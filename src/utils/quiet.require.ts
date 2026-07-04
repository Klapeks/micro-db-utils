

export function quietRequire<T>(module: string): T | undefined {
    try {
        return require(module);
    } catch (err) {
        return undefined;
    }
}