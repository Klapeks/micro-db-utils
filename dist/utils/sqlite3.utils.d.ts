import { Database } from "sqlite3";
export declare const sqlite3_utils: (db: Database) => {
    all: <T>(query: string) => Promise<T[]>;
};
