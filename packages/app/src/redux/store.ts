import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appReducer from "./reducers/appReducer";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { config } from "./config";

const encryptor = encryptTransform({
  secretKey: config.REDUX_ENCRYPT_KEY,
  onError: function (/* error */) {
    // @TODO: Handle the error.
  },
});

const persistConfig = {
  key: "primary",
  storage: AsyncStorage,
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  app: appReducer,
});

// @ts-expect-error TODO: redux
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
