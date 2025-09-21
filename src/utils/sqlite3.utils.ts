import { Database } from "sqlite3";


export const sqlite3_utils = (db: Database) => {

    async function all<T>(query: string): Promise<T[]> {
        return await new Promise<T[]>((resolve, reject) => {
            db.all(query, (err, data) => {
                if (err) reject(err);
                else resolve(data as any);
            })
        });
    }
    
    return { all };
}
