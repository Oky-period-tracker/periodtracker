"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formActions = exports.GO_TO_STEP = void 0;
exports.MultiStepForm = MultiStepForm;
exports.useMultiStepForm = useMultiStepForm;
const react_1 = __importDefault(require("react"));
const redux_1 = require("redux");
const MultiStepFormContext = react_1.default.createContext(undefined);
exports.GO_TO_STEP = 'GO_TO_STEP';
exports.formActions = {
    goToStep: stepName => ({ type: exports.GO_TO_STEP, stepName }),
};
const formInitialState = {
    currentStep: 0,
};
function formReducer(state = formInitialState, action) {
    if (action.type === '__INIT__') {
        return {
            currentStep: action.initialStep,
        };
    }
    if (action.formAction && action.formAction.type === exports.GO_TO_STEP) {
        return Object.assign(Object.assign({}, state), { currentStep: action.formAction.stepName });
    }
    return state;
}
function MultiStepForm({ initialStep, appReducer, children, }) {
    const rootReducer = (0, redux_1.combineReducers)({
        app: appReducer,
        form: formReducer,
    });
    const store = react_1.default.useReducer(rootReducer, undefined, () => {
        const initialState = rootReducer(undefined, { type: '__INIT__', initialStep });
        return initialState;
    });
    const [formState, formDispatch] = store;
    return (<MultiStepFormContext.Provider value={store}>
      {react_1.default.Children.toArray(children).reduce((elements, child) => {
            if (child.props.step !== formState.form.currentStep) {
                return elements;
            }
            return elements.concat(react_1.default.cloneElement(child, Object.assign({ formState,
                formDispatch }, child.props)));
        }, [])}
    </MultiStepFormContext.Provider>);
}
function useMultiStepForm() {
    const multiStepFormContext = react_1.default.useContext(MultiStepFormContext);
    if (multiStepFormContext === undefined) {
        throw new Error(`useMultiStepForm must be used within a MultiStepForm`);
    }
    return multiStepFormContext;
}
//# sourceMappingURL=MultiStepForm.jsx.map