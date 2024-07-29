"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProvider = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_2 = require("redux-persist/integration/react");
const ThemeContext_1 = require("./context/ThemeContext");
const LocaleContext_1 = require("./context/LocaleContext");
const DisplayTextContext_1 = require("./context/DisplayTextContext");
const PredictionProvider_1 = require("./context/PredictionProvider");
const AlertContext_1 = require("./context/AlertContext");
const Flower_1 = require("../optional/Flower");
const AppProvider = ({ children, store, persistor }) => (<react_redux_1.Provider store={store}>
    <react_2.PersistGate loading={null} persistor={persistor}>
      <LocaleContext_1.LocaleProvider>
        <ThemeContext_1.ThemeProvider>
          <PredictionProvider_1.PredictionProvider>
            <Flower_1.FlowerProvider>
              <AlertContext_1.AlertContextProvider>
                <DisplayTextContext_1.DisplayTextProvider>{children}</DisplayTextContext_1.DisplayTextProvider>
              </AlertContext_1.AlertContextProvider>
            </Flower_1.FlowerProvider>
          </PredictionProvider_1.PredictionProvider>
        </ThemeContext_1.ThemeProvider>
      </LocaleContext_1.LocaleProvider>
    </react_2.PersistGate>
  </react_redux_1.Provider>);
exports.AppProvider = AppProvider;
//# sourceMappingURL=AppProvider.jsx.map