export interface TransportData<T> {
    isEnd: boolean,
    data: T | null,
    error: string | null
}
