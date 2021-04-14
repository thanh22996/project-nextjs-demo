import * as types from "./types";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  count: 0,
  error: false,
  lastUpdate: 0,
  light: false,
  placeholderData: null,
};

function reducer(state, action) {
  switch (action.type) {
    case HYDRATE: {
      return { ...state, ...action.payload };
    }

    case types.FAILURE:
      return {
        ...state,
        ...{ error: action.error },
      };

    case types.INCREMENT:
      return {
        ...state,
        ...{ count: state.count + 1 },
      };

    case types.DECREMENT:
      return {
        ...state,
        ...{ count: state.count - 1 },
      };

    case types.RESET:
      return {
        ...state,
        ...{ count: initialState.count },
      };

    case types.LOAD_DATA_SUCCESS:
      return {
        ...state,
        ...{ placeholderData: action.data },
      };

    case types.TICK_CLOCK:
      return {
        ...state,
        ...{ lastUpdate: action.ts, light: !!action.light },
      };

    default:
      return state;
  }
}

export default reducer;
