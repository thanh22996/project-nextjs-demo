import * as types from "./types";

export function failure(error) {
  return {
    type: types.FAILURE,
    error,
  };
}

export function increment() {
  return { type: types.INCREMENT };
}

export function decrement() {
  return { type: types.DECREMENT };
}

export function reset() {
  return { type: types.RESET };
}

export function loadData() {
  return { type: types.LOAD_DATA };
}

export function loadDataSuccess(data) {
  return {
    type: types.LOAD_DATA_SUCCESS,
    data,
  };
}

export function startClock() {
  return { type: types.START_CLOCK };
}

export function tickClock(isServer) {
  return {
    type: types.TICK_CLOCK,
    light: !isServer,
    ts: Date.now(),
  };
}
