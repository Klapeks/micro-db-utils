

export const microDBUtilsConfig = {
    debugSQL: process.env.DEBUG_SQL == 'true'
        || process.env.SQL_DEBUG == 'true'
}