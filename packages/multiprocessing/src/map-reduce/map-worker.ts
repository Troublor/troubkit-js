import {TransportData} from "./ipc";

const mapperFile = process.argv[2];

import(mapperFile).then(m => {
    const mapper = m.default;
    process.on("message", async (msg: TransportData<unknown>) => {
        if (msg.isEnd) {
            process.send?.({
                isEnd: true,
                data: null,
                error: null,
            } as TransportData<unknown>);
            process.exit(0);
        }
        try {
            const mapped = await mapper(msg.data);
            process.send?.({
                isEnd: false,
                data: mapped,
                error: null,
            } as TransportData<unknown>);
        } catch (e) {
            process.send?.({
                isEnd: false,
                data: msg.data,
                error: e.message,
            } as TransportData<unknown>);
        }
    });
}).catch(e => {
    process.send?.({
        isEnd: true,
        data: null,
        error: e.message,
    } as TransportData<unknown>);
    process.exit(1);
});
