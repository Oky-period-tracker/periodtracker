"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouteName = exports.BackOneScreen = exports.replace = exports.navigateAndReset = exports.navigate = exports.setTopLevelNavigator = void 0;
const react_navigation_1 = require("react-navigation");
let navigator;
// Called on Root Screen
const setTopLevelNavigator = (navigatorRef) => {
    navigator = navigatorRef;
};
exports.setTopLevelNavigator = setTopLevelNavigator;
// Call to navigate to a specific Route
const navigate = (routeName, params) => {
    navigator.dispatch(react_navigation_1.NavigationActions.navigate({
        routeName,
        params,
    }));
};
exports.navigate = navigate;
// Call to navigate and reset so that the person cant go back
const navigateAndReset = (routeName, params) => {
    navigator.dispatch(react_navigation_1.StackActions.reset({
        index: 0,
        key: null,
        actions: [
            react_navigation_1.NavigationActions.navigate({
                routeName,
                params,
            }),
        ],
    }));
};
exports.navigateAndReset = navigateAndReset;
// Call to replace screen on stack
const replace = (routeName, params = undefined) => {
    navigator.dispatch(react_navigation_1.StackActions.replace({
        routeName,
        params,
    }));
};
exports.replace = replace;
// Call to go back one screen on stack
const BackOneScreen = () => {
    navigator.dispatch(react_navigation_1.NavigationActions.back());
};
exports.BackOneScreen = BackOneScreen;
const maxDepth = 1000;
const getRouteName = (navigation, currentDepth = 0) => {
    if (currentDepth > maxDepth) {
        return undefined;
    }
    const route = navigation.routes[navigation.index];
    if ((route === null || route === void 0 ? void 0 : route.index) !== undefined) {
        return (0, exports.getRouteName)(route, currentDepth + 1);
    }
    return route === null || route === void 0 ? void 0 : route.routeName;
};
exports.getRouteName = getRouteName;
//# sourceMappingURL=navigationService.js.map