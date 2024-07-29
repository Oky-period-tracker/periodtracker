"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
exports.configureStore = configureStore;
const redux_1 = require("redux");
const redux_persist_1 = require("redux-persist");
const redux_persist_transform_encrypt_1 = require("redux-persist-transform-encrypt");
const storage_1 = __importDefault(require("redux-persist/lib/storage"));
const redux_saga_1 = __importDefault(require("redux-saga"));
const remote_redux_devtools_1 = require("remote-redux-devtools");
const reducers_1 = require("./reducers");
const sagas_1 = require("./sagas");
const config_1 = require("./config");
const encryptor = (0, redux_persist_transform_encrypt_1.encryptTransform)({
    secretKey: config_1.config.REDUX_ENCRYPT_KEY,
    onError(error) {
        // Handle the error.
    },
});
exports.version = -1;
function configureStore(key = 'primary') {
    const persistConfig = {
        version: exports.version,
        key,
        storage: storage_1.default,
        timeout: 10000,
        throttle: 500,
        blacklist: [],
        transforms: [encryptor],
    };
    const persistedReducer = (0, redux_persist_1.persistReducer)(persistConfig, reducers_1.rootReducer);
    const composeEnhancers = (0, remote_redux_devtools_1.composeWithDevTools)({
        //  port: 8081,
        realtime: true,
        port: 8000,
        hostname: '', // add your computer's IP
    });
    const sagaMiddleware = (0, redux_saga_1.default)();
    const store = (0, redux_1.createStore)(persistedReducer, composeEnhancers((0, redux_1.applyMiddleware)(sagaMiddleware)));
    const persistor = (0, redux_persist_1.persistStore)(store);
    sagaMiddleware.run(sagas_1.rootSaga);
    return { store, persistor };
}
//# sourceMappingURL=store.js.map