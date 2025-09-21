import { DatabaseOptions } from "@klapeks/utils";
export declare function runRawBackup({ module, options, tables, outputFolder }: {
    module: string;
    options: DatabaseOptions;
    tables: string[];
    outputFolder: string;
}): Promise<void>;
