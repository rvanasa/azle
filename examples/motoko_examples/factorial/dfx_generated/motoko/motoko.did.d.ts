import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface PerfResult {
    wasm_body_only: bigint;
    wasm_including_prelude: bigint;
}
export interface _SERVICE {
    fac: ActorMethod<[bigint], bigint>;
    get_perf_result: ActorMethod<[], [] | [PerfResult]>;
}
