import { Repository, SelectQueryBuilder } from "typeorm";


let _alreadyPatched = false;

export function patchTypeorm() {
    if (_alreadyPatched) return;

    
    { // repository changes
        const originalUpdate = Repository.prototype.update;
        Repository.prototype.update = function (...args: any[]) {
            let _wasDel = false;
            for (let key of Object.keys(args[0])) {
                if (typeof args[1] === 'object' && key in args[1]) {
                    if (args[0][key] === args[1][key]) {
                        if (!_wasDel) {
                            args[1] = {...args[1]};
                            _wasDel = true;
                        }
                        delete args[1][key]; 
                    }
                }
            }
            return originalUpdate.apply(this, args as any);
        };
        const originalUpsert = Repository.prototype.upsert;
        Repository.prototype.upsert = async function (...args: any[]) {
            if (this.manager.connection.options.type === "mssql") {
                return this.save(args[0]);
            }
            return originalUpsert.apply(this, args as any);
        };
    }


    { // query builder changes changes
        const whereFix = (dbtype: string, args: any[]) => {
            if (args[0] && typeof args[0] === 'string') {
                if (dbtype == 'mssql') {
                    args[0] = args[0].replace(/\btrue\b/g, "1");
                    args[0] = args[0].replace(/\bfalse\b/g, "0");
                }
            }
            return args as any;
        }
        const originalWhere = SelectQueryBuilder.prototype.where;
        SelectQueryBuilder.prototype.where = function (...args: any[]) {
            const dbType = this.connection.options.type 
                || (this as any).dataSource?.options.type;
            return originalWhere.apply(this, whereFix(dbType, args));
        };
        const originalAndWhere = SelectQueryBuilder.prototype.andWhere;
        SelectQueryBuilder.prototype.andWhere = function (...args: any[]) {
            const dbType = this.connection.options.type 
                || (this as any).dataSource?.options.type;
            return originalAndWhere.apply(this, whereFix(dbType, args));
        };
    }

    _alreadyPatched = true;
}