
const pad2 = (p: string | number) => {
    return p.toString().padStart(2, '0');
}

export function toISODate(date: Date, type?: 'yyyy-mm-dd' | "full") {
    if (type === 'yyyy-mm-dd') {
        return date.getFullYear()
            + '-' + pad2(date.getMonth() + 1)
            + '-' + pad2(date.getDate());
    }
    return date.getFullYear()
        + '-' + pad2(date.getMonth() + 1)
        + '-' + pad2(date.getDate())
        + ' ' + pad2(date.getHours())
        + ':' + pad2(date.getMinutes())
        + ':' + pad2(date.getSeconds());
}

export function dateFromNow(func: (date: Date) => void, date?: Date) {
    if (!date) date = new Date();
    func(date);
    return date;
}