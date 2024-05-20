const initialState = {
  data: false,
  name: "bob",
};

export const setData = (data) => {
  return {
    type: "SET_DATA",
    payload: data,
  };
};

export const setName = (data) => {
  return {
    type: "SET_NAME",
    payload: data,
  };
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        name: action.payload,
      };
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
