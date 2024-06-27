import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { config } from "./config";
import { rootReducer } from "./reducers";

const encryptor = encryptTransform({
  secretKey: config.REDUX_ENCRYPT_KEY,
  onError: function (/* error */) {
    // @TODO: Handle the error.
  },
});

export const version = -1;

const persistConfig = {
  version,
  key: "primary",
  storage: AsyncStorage,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };

export type ReduxState = ReturnType<typeof rootReducer>;
