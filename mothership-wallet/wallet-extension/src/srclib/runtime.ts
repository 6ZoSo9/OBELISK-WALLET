import { DEAD_SPACE_CHAIN as DS_DEFAULT } from './chain'
let RUNTIME:any = null
export function setRuntimeConfig(cfg:any){ RUNTIME = cfg }
export function runtime(){ return RUNTIME }
export function dsChain(){ return (RUNTIME?.DEAD_SPACE_CHAIN)||DS_DEFAULT }
