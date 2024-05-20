const initialState = {
  data: false,
};

export const setData = (data) => {
  return {
    type: "SET_DATA",
    payload: data,
  };
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default appReducer;
