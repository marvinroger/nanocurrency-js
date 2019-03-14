interface Cwrap {
  (fun: 'emscripten_work', ret: 'string', params: ['string', 'number', 'number']): (blockHash: string, workerIndex: number, workerCount: number) => string
}

declare interface Assembly {
  cwrap: Cwrap
}

declare function Module(): Promise<Assembly>

export default Module
