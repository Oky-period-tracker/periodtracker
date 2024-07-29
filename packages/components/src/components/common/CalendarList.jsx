"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarList = CalendarList;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_calendars_1 = require("react-native-calendars");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const index_1 = require("../../assets/index");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const core_1 = require("@oky/core");
react_native_calendars_1.LocaleConfig.locales = Object.assign(Object.assign({}, react_native_calendars_1.LocaleConfig.locales), core_1.calendarTranslations);
function CalendarList({ handleMonthChange, currentMonth = (0, moment_timezone_1.default)().format(), highlightedDates = {}, setInputDay, width = null, }) {
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    react_native_calendars_1.LocaleConfig.defaultLocale = locale;
    const [markedDates, setMarkedDates] = react_1.default.useState({});
    const calendarRef = react_1.default.useRef();
    react_1.default.useEffect(() => {
        setMarkedDates(highlightedDates);
    }, [highlightedDates]);
    const arrowFunctiions = typeof handleMonthChange !== 'undefined'
        ? {
            current: currentMonth,
            onPressArrowLeft: () => handleMonthChange('sub'),
            onPressArrowRight: () => handleMonthChange('add'),
        }
        : {};
    return (<react_native_calendars_1.CalendarList {...arrowFunctiions} ref={calendarRef} initialNumToRender={3} theme={{
            monthTextColor: '#f49200',
            textMonthFontSize: 20,
            textMonthFontFamily: 'Roboto-Black',
            // @ts-ignore
            'stylesheet.day.period': {
                base: {
                    overflow: 'hidden',
                    height: 34,
                    alignItems: 'center',
                    width: 38,
                },
                today: {
                    backgroundColor: '#f49200',
                },
                todayText: {
                    fontWeight: '700',
                    color: 'white',
                },
            },
        }} horizontal={true} // Enable paging on horizontal
     pagingEnabled={true} renderArrow={(direction) => {
            if (direction === 'left')
                return <react_native_1.Image source={index_1.assets.static.icons.back} style={{ height: 20, width: 20 }}/>;
            return (<react_native_1.Image source={index_1.assets.static.icons.back} style={{ height: 20, width: 20, transform: [{ scaleX: -1 }] }}/>);
        }} pastScrollRange={24} // months
     futureScrollRange={12} // months
     calendarWidth={width || 340} onDayPress={(day) => {
            const userTimeZone = moment_timezone_1.default.tz.guess();
            moment_timezone_1.default.tz.setDefault(userTimeZone);
            // setInputDay(momentTimezone(dateData).tz('America/Santiago', true))
            setInputDay((0, moment_timezone_1.default)(day.dateString).startOf('day'));
        }} markedDates={markedDates} markingType={'custom'} hideArrows={false}/>);
}
//# sourceMappingURL=CalendarList.jsx.map