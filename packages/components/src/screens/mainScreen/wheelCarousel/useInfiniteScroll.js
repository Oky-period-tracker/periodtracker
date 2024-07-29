"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInfiniteScroll = useInfiniteScroll;
const react_1 = __importDefault(require("react"));
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const react_native_redash_1 = require("react-native-redash");
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const PredictionProvider_1 = require("../../../components/context/PredictionProvider");
const today = (0, moment_1.default)().startOf('day');
const todayMinusSevenDays = (0, moment_1.default)(today.clone().add(-7, 'days'));
const todaysPlusFourDays = (0, moment_1.default)(today.clone().add(4, 'days'));
const { Value, Clock, useCode, onChange, clockRunning, block, set, cond, eq, add, not, floor, modulo, call, } = react_native_reanimated_1.default;
const initialState = {
    startDate: todayMinusSevenDays,
    endDate: todaysPlusFourDays,
    offset: 0,
    currentIndex: 0,
    page: 0,
};
const ITEM_LENGTH = 12;
const RESET_AFTER = 8000;
const RESET_ANIMATION_DURATION = 4000;
var RESET_STATE;
(function (RESET_STATE) {
    RESET_STATE[RESET_STATE["INACTIVE"] = 0] = "INACTIVE";
    RESET_STATE[RESET_STATE["ACTIVE"] = 1] = "ACTIVE";
})(RESET_STATE || (RESET_STATE = {}));
function reorderData(array, offset = 0) {
    const reorder = lodash_1.default.chunk(array, array.length / 2)
        .reverse()
        .flat();
    if (offset < 0) {
        return [
            ...lodash_1.default.takeRight(reorder, array.length - Math.abs(offset)),
            ...lodash_1.default.take(reorder, Math.abs(offset)),
        ];
    }
    return [...lodash_1.default.takeRight(reorder, offset), ...lodash_1.default.take(reorder, array.length - offset)];
}
function useInfiniteScroll() {
    const [state, setState] = react_1.default.useState(initialState);
    const { startDate, endDate, offset, currentIndex, page } = state;
    const fullInfoForDateRange = (0, PredictionProvider_1.useCalculateFullInfoForDateRange)(startDate, endDate);
    const isActive = new Value(0);
    const absoluteIndex = new Value(0);
    const floorAbsoluteIndex = floor(add(absoluteIndex, 0.00001));
    const index = modulo(add(absoluteIndex, 0.00001), ITEM_LENGTH);
    const clock = new Clock();
    const shouldReset = new Value(0);
    const resetState = react_1.default.useRef(new Value(RESET_STATE.INACTIVE));
    const springConfig = {
        toValue: new Value(0.00001),
        damping: 15,
        mass: 1,
        stiffness: 150,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    };
    react_1.default.useEffect(() => {
        if (currentIndex === 0 && page === 0) {
            return;
        }
        const timeout = setTimeout(() => {
            // @ts-ignore
            resetState.current.setValue(RESET_STATE.ACTIVE);
        }, RESET_AFTER);
        return () => {
            resetState.current.setValue(RESET_STATE.INACTIVE);
            clearTimeout(timeout);
        };
    }, [currentIndex, page]);
    useCode(block([
        cond(eq(resetState.current, RESET_STATE.ACTIVE), [set(shouldReset, 1)]),
        cond(eq(shouldReset, 1), [
            set(absoluteIndex, (0, react_native_redash_1.runSpring)(clock, absoluteIndex, 0.00001, springConfig)),
            cond(not(clockRunning(clock)), [
                set(shouldReset, 0),
                set(resetState.current, RESET_STATE.INACTIVE),
            ]),
        ]),
        onChange(floorAbsoluteIndex, [
            call([floorAbsoluteIndex], lodash_1.default.debounce((idx) => {
                const nextIndex = idx[0];
                const absIndex = Math.abs(nextIndex);
                const absOffset = Math.abs(absIndex % ITEM_LENGTH);
                const pageNumber = Math.ceil(absIndex / ITEM_LENGTH);
                // scroll into the future
                if (nextIndex > 0) {
                    return setState({
                        startDate: todayMinusSevenDays.clone().add(absIndex, 'days'),
                        endDate: todaysPlusFourDays.clone().add(absIndex, 'days'),
                        currentIndex: absOffset,
                        offset: absOffset,
                        page: pageNumber,
                    });
                }
                // scroll into the past
                return setState({
                    startDate: todayMinusSevenDays.clone().add(-absIndex, 'days'),
                    endDate: todaysPlusFourDays.clone().add(-absIndex, 'days'),
                    currentIndex: (ITEM_LENGTH - absOffset) % ITEM_LENGTH,
                    offset: -absOffset,
                    page: pageNumber,
                });
            }, 100)),
        ]),
    ]), []);
    return {
        data: reorderData(fullInfoForDateRange, offset),
        isActive,
        index,
        currentIndex,
        absoluteIndex,
    };
}
//# sourceMappingURL=useInfiniteScroll.js.map