"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SafeAreaView = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _SafeAreaContext = require("./SafeAreaContext");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// prettier-ignore
const TOP = 0b1000,
  RIGHT = 0b0100,
  BOTTOM = 0b0010,
  LEFT = 0b0001,
  ALL = 0b1111;

/* eslint-disable no-bitwise */

const edgeBitmaskMap = {
  top: TOP,
  right: RIGHT,
  bottom: BOTTOM,
  left: LEFT
};
const SafeAreaView = exports.SafeAreaView = /*#__PURE__*/React.forwardRef(({
  style = {},
  mode,
  edges,
  ...rest
}, ref) => {
  const insets = (0, _SafeAreaContext.useSafeAreaInsets)();
  const edgeBitmask = edges != null ? Array.isArray(edges) ? edges.reduce((acc, edge) => acc | edgeBitmaskMap[edge], 0) : Object.keys(edges).reduce((acc, edge) => acc | edgeBitmaskMap[edge], 0) : ALL;
  const appliedStyle = React.useMemo(() => {
    const insetTop = edgeBitmask & TOP ? insets.top : 0;
    const insetRight = edgeBitmask & RIGHT ? insets.right : 0;
    const insetBottom = edgeBitmask & BOTTOM ? insets.bottom : 0;
    const insetLeft = edgeBitmask & LEFT ? insets.left : 0;
    const flatStyle = _reactNative.StyleSheet.flatten(style);
    if (mode === 'margin') {
      const {
        margin = 0,
        marginVertical = margin,
        marginHorizontal = margin,
        marginTop = marginVertical,
        marginRight = marginHorizontal,
        marginBottom = marginVertical,
        marginLeft = marginHorizontal
      } = flatStyle;
      const marginStyle = {
        marginTop: marginTop + insetTop,
        marginRight: marginRight + insetRight,
        marginBottom: marginBottom + insetBottom,
        marginLeft: marginLeft + insetLeft
      };
      return [style, marginStyle];
    } else {
      const {
        padding = 0,
        paddingVertical = padding,
        paddingHorizontal = padding,
        paddingTop = paddingVertical,
        paddingRight = paddingHorizontal,
        paddingBottom = paddingVertical,
        paddingLeft = paddingHorizontal
      } = flatStyle;
      const paddingStyle = {
        paddingTop: paddingTop + insetTop,
        paddingRight: paddingRight + insetRight,
        paddingBottom: paddingBottom + insetBottom,
        paddingLeft: paddingLeft + insetLeft
      };
      return [style, paddingStyle];
    }
  }, [style, insets, mode, edgeBitmask]);
  return /*#__PURE__*/React.createElement(_reactNative.View, _extends({
    style: appliedStyle
  }, rest, {
    ref: ref
  }));
});
//# sourceMappingURL=SafeAreaView.web.js.map