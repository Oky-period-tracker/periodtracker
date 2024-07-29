"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColor = useColor;
const ThemeContext_1 = require("../components/context/ThemeContext");
function useColor(isOnPeriod, isOnFertile) {
    const { fertileColor, periodColor, nonPeriodColor, periodNotVerifiedColor } = (0, ThemeContext_1.useTheme)();
    if (isOnPeriod)
        return periodColor;
    if (isOnFertile)
        return fertileColor;
    return nonPeriodColor;
}
//# sourceMappingURL=useColor.js.map