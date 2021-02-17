export * from "./reactive-structures";
export * from "./promievent";

export async function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function convenientTimeString(options: { date?: boolean, moment?: boolean, millisecond?: boolean } = {
    date: true,
    moment: true,
    millisecond: true,
}): string {
    const now = new Date();
    let str = "";
    if (options.date) {
        str += `${now.getFullYear().toString().padStart(4, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    }
    if (options.moment || options.millisecond) {
        str += (str.length > 0 ? " " : "") + `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    }
    if (options.millisecond) {
        str += `.${now.getMilliseconds().toString().padEnd(3, "0")}`;
    }
    return str;
}

export function removeItem<T>(array: T[], value: T): T[] {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}
