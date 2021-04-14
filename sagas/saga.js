import { all, call, delay, put, take, takeLatest } from "redux-saga/effects";
import { failure, loadDataSuccess, tickClock } from "../redux/actions";
import * as types from "../redux/types";
import { callAPI } from "../api";

function* runClockSaga() {
  yield take(types.START_CLOCK);
  while (true) {
    yield put(tickClock(false));
    yield delay(1000);
  }
}

function* loadDataSaga() {
  try {
    const res = yield call(callAPI.FetchMockApi);
    // console.log("----------------", res);
    const data = yield res.json();
    yield put(loadDataSuccess(data));
  } catch (err) {
    yield put(failure(err));
  }
}

function* rootSaga() {
  yield all([call(runClockSaga), takeLatest(types.LOAD_DATA, loadDataSaga)]);
}

export default rootSaga;
