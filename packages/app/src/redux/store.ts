import { createStore, combineReducers } from "redux";
// Import your reducers here
import appReducer from "./reducers/appReducer";

const rootReducer = combineReducers({
  // Add your reducers here
  app: appReducer,
});

const store = createStore(rootReducer);

export default store;
