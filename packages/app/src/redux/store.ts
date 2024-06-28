import { applyMiddleware, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./reducers";
import { rootSaga } from "./sagas";
import { config } from "./config";

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

const sagaMiddleware = createSagaMiddleware();

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };

export type ReduxState = ReturnType<typeof rootReducer>;
