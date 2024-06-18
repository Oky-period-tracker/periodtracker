const initialState = {
  data: false,
  name: "bob",
};

export const setData = (data: boolean) => {
  return {
    type: "SET_DATA",
    payload: data,
  };
};

export const setName = (data: string) => {
  return {
    type: "SET_NAME",
    payload: data,
  };
};

// @ts-expect-error TODO: redux
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
