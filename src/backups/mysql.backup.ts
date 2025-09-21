import mPath from 'path';
import fs from 'fs';
import { spawn } from "child_process";
import os from 'os';
import { DatabaseOptions, logger } from "@klapeks/utils";

const pad = (s: number) => s < 10 ? `0${s}` : s;
function dateToStr(date: Date) {
    return date.getFullYear() 
        + '-' + pad(date.getMonth() + 1)
        + '-' + pad(date.getDate());
}

export async function runRawBackup({ module, options, tables, outputFolder }: {
    module: string, options: DatabaseOptions, tables: string[], outputFolder: string
}): Promise<void> {
    if (!options.type) return;
    if (!tables?.length) return;
    if (os.platform() == 'win32') return;

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    logger.log("Starting database backup:", options.type, '|', tables);
    const date = new Date();

    if (options.type == 'mysql') {
        // const filePath = mPath.join(BACKUP_FILES, 
        //     dateToStr(date) + '--' + databaseName + '.sql');
        const filePath = mPath.join(outputFolder, 'backup-' + dateToStr(date) + '-' + module + '.sql');
        if (fs.existsSync(filePath)) fs.rmSync(filePath, { force: true });

        const file = fs.createWriteStream(filePath);
        file.write('-- BSB v4 dump. Tables: ' + tables.join(', ') + '\n');
        file.write('-- DateTime: ' + new Date().toISOString().replace('T', ' ').replace('Z', '') + '\n');
        try {
            const dump = spawn('mysqldump', [
                '--skip-extended-insert', 
                '--host=' + options.host,
                '--port=' + options.port,
                '--user=' + options.username,
                '--password=' + options.password,
                '--databases', options.database,
                '--tables', ...tables
            ]);
            await new Promise<any>((resolve, reject) => {
                let error = '';
                dump.stdout.on('data', (data) => file.write(data));
                dump.stderr.on('data', (data) => {
                    if (String(data).toLowerCase().includes('[warning]')) return;
                    error += String(data);
                });
                dump.once('exit', (code) => {
                    dump.kill();
                    if (code) {
                        logger.log('child process exited with code ' + code);
                        return reject(error);
                    }
                    resolve("Done");
                });
            });
            file.end();
            logger.log("└ Backup completed and saved at\n", filePath);
            const stat = fs.statSync(filePath);
            logger.log("└ Backup size:", +(stat.size / 1024).toFixed(2), 'KB',
                    '/', +(stat.size / 1024 / 1024).toFixed(2), 'MB');
            return;
        } catch (err: any) {
            file.end(() => {
                fs.rmSync(filePath, { force: true });
            });
            if ((err?.sqlMessage as string)?.toLowerCase().includes("unknown database")) return;
            logger.error("Error while backuping database:", err);
            return;
        }
    }
    throw "Unknown database type for backup: " + options.type
}

// export function runMicroBackup(micro: MicroServer, dataSource: DataSource) {
//     return runRawBackup({
//         module: micro.options.microServer, 
//         options: dataSourceOptions(),
//         tables: Object.values(dataSource.options.entities || []).map((m: any) => {
//             if (m instanceof EntitySchema) return m.options.name;
//             return undefined;
//         }).filter(Boolean) as string[],
//         outputFolder: minEnv.coreDataFile('backups')
//     })
// }
// export async function initBackups(micro: MicroServer, dataSource: DataSource) {
//     cron.schedule('50 23 * * *', async () => {
//         await runMicroBackup(micro, dataSource);
//     });
//     await runMicroBackup(micro, dataSource);
// }