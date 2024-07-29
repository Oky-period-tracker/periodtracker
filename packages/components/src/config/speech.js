"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsScreenText = exports.encyclopediaScreenText = exports.termsScreenText = exports.privacyScreenText = exports.aboutScreenText = exports.acessSettingsScreenText = exports.settingsScreenText = exports.profileScreenSpeech = exports.calendarScreenSpeech = exports.spinLoaderSpeech = exports.predictionChangeScreenSpeech = exports.mainScreenSpeech = void 0;
const i18n_1 = require("../i18n");
const moment_1 = __importDefault(require("moment"));
const mainScreenSpeech = ({ data, wheelDaysInfo, todayInfo }) => {
    const infiniteDays = data.map((day) => [
        (0, i18n_1.translate)('day') + day.cycleDay.toString(),
        day.date.format('DD MMMM'),
        (0, i18n_1.translate)('mood'),
        (0, i18n_1.translate)('body'),
        (0, i18n_1.translate)('activity'),
        (0, i18n_1.translate)('flow'),
    ]);
    return [
        (0, i18n_1.translate)('calendar'),
        (0, i18n_1.translate)('main_calendar_screen'),
        (0, i18n_1.translate)('calendar_shortcut'),
        (0, i18n_1.translate)('avatar'),
        (0, i18n_1.translate)('wheel_text'),
        ...wheelDaysInfo,
        todayInfo.cycleLength + (0, i18n_1.translate)('days'),
        todayInfo.onPeriod
            ? todayInfo.daysLeftOnPeriod.toString() + (0, i18n_1.translate)('left')
            : todayInfo.daysUntilNextPeriod.toString() + (0, i18n_1.translate)('to_go'),
        (0, i18n_1.translate)('large_day_card'),
        ...infiniteDays[0].flat(),
    ];
};
exports.mainScreenSpeech = mainScreenSpeech;
const predictionChangeScreenSpeech = () => [
    (0, i18n_1.translate)('tutorial_launch_label'),
    (0, i18n_1.translate)('share_period_details_heading'),
    (0, i18n_1.translate)('user_input_instructions'),
    // translate('prediction_change'),
    // translate('period_start_cloud'),
    (0, i18n_1.translate)('period_day_cloud'),
    (0, i18n_1.translate)('no_period_day_cloud'),
];
exports.predictionChangeScreenSpeech = predictionChangeScreenSpeech;
const spinLoaderSpeech = () => [(0, i18n_1.translate)('please_wait_tutorial')];
exports.spinLoaderSpeech = spinLoaderSpeech;
const calendarScreenSpeech = ({ opacity, isVisible, weekDays, monthDaysInfo, currentDay, }) => {
    const check = (0, moment_1.default)(currentDay, 'YYYY/MM/DD');
    const month = check.format('MM');
    const day = check.format('D');
    const year = check.format('YYYY');
    const monthDate = (0, moment_1.default)(year + '-' + month, 'YYYY-MM');
    let daysInMonth = monthDate.daysInMonth();
    const arrDays = [];
    while (daysInMonth) {
        const current = (0, moment_1.default)(currentDay).date(daysInMonth);
        arrDays.push(current.format('DD MMM'));
        daysInMonth--;
    }
    const currenMonthDays = arrDays.reverse();
    if (isVisible && opacity === 0)
        return (0, exports.predictionChangeScreenSpeech)();
    return isVisible
        ? [
            (0, i18n_1.translate)('daily_card_and_period_info'),
            (0, i18n_1.translate)('to_daily_card'),
            (0, i18n_1.translate)('change_period'),
        ]
        : [
            (0, i18n_1.translate)('arrow_button'),
            (0, i18n_1.translate)('calendar'),
            (0, i18n_1.translate)('previous_month'),
            `${currentDay.format('MMMM')} ${currentDay.format('YYYY')}`,
            (0, i18n_1.translate)('next_month'),
            ...weekDays,
            ...currenMonthDays,
        ];
};
exports.calendarScreenSpeech = calendarScreenSpeech;
const profileScreenSpeech = ({ currentUser, todayInfo, dateOfBirth, selectedAvatar, theme, }) => {
    var _a;
    return [
        (0, i18n_1.translate)('arrow_button'),
        (0, i18n_1.translate)('profile'),
        (0, i18n_1.translate)('name'),
        currentUser.name,
        (0, i18n_1.translate)('age'),
        (0, i18n_1.translate)(dateOfBirth.format('MMM')) + ' ' + dateOfBirth.format('YYYY'),
        (0, i18n_1.translate)('gender'),
        (0, i18n_1.translate)(currentUser.gender),
        (0, i18n_1.translate)('green_btn_with_two_arrows'),
        (0, i18n_1.translate)('location'),
        (0, i18n_1.translate)(currentUser.location),
        (0, i18n_1.translate)('green_btn_with_two_arrows'),
        (0, i18n_1.translate)('cycle_length'),
        todayInfo.cycleLength.toString() + (0, i18n_1.translate)('days'),
        (0, i18n_1.translate)('period_length'),
        ((_a = todayInfo === null || todayInfo === void 0 ? void 0 : todayInfo.periodLength) === null || _a === void 0 ? void 0 : _a.toString()) + (0, i18n_1.translate)('days'),
        // translate(`selected_avatar`),
        (0, i18n_1.translate)(selectedAvatar),
        // translate('selected_theme'),
        (0, i18n_1.translate)(theme),
    ];
};
exports.profileScreenSpeech = profileScreenSpeech;
const settingsScreenText = ({ hasTtsActive }) => [
    (0, i18n_1.translate)('settings'),
    (0, i18n_1.translate)('about'),
    (0, i18n_1.translate)('about_info'),
    (0, i18n_1.translate)('t_and_c'),
    (0, i18n_1.translate)('t_and_c_info'),
    (0, i18n_1.translate)('privacy_policy'),
    (0, i18n_1.translate)('privacy_info'),
    (0, i18n_1.translate)('access_setting'),
    (0, i18n_1.translate)('settings_info'),
    (0, i18n_1.translate)('text_to_speech'),
    (0, i18n_1.translate)('text_to_speech_info'),
    `text to speech ${hasTtsActive ? 'on' : 'off'}`,
    (0, i18n_1.translate)('logout'),
    (0, i18n_1.translate)('delete_account_button'),
    (0, i18n_1.translate)('contact_us'),
];
exports.settingsScreenText = settingsScreenText;
const acessSettingsScreenText = () => [
    (0, i18n_1.translate)('access_setting'),
    (0, i18n_1.translate)('tutorial'),
    (0, i18n_1.translate)('tutorial_subtitle'),
    (0, i18n_1.translate)('launch'),
    (0, i18n_1.translate)('share'),
    (0, i18n_1.translate)('share_qr_description'),
    (0, i18n_1.translate)('share_setting'),
];
exports.acessSettingsScreenText = acessSettingsScreenText;
const aboutScreenText = () => [
    (0, i18n_1.translate)('arrow_button'),
    (0, i18n_1.translate)('about'),
    (0, i18n_1.translate)('about_content_1'),
    (0, i18n_1.translate)('about_heading_1'),
    (0, i18n_1.translate)('about_content_2'),
    (0, i18n_1.translate)('about_heading_2'),
    (0, i18n_1.translate)('about_content_3'),
    (0, i18n_1.translate)('about_content_4'),
    (0, i18n_1.translate)('about_content_5'),
    (0, i18n_1.translate)('about_heading_3'),
    (0, i18n_1.translate)('about_content_6'),
    (0, i18n_1.translate)('about_heading_4'),
    (0, i18n_1.translate)('about_content_7'),
    (0, i18n_1.translate)('about_heading_5'),
    (0, i18n_1.translate)('about_content_8'),
    (0, i18n_1.translate)('about_content_9'),
];
exports.aboutScreenText = aboutScreenText;
const privacyScreenText = () => [
    (0, i18n_1.translate)('arrow_button'),
    (0, i18n_1.translate)('privacy_heading_1'),
    (0, i18n_1.translate)('privacy_content_1'),
    (0, i18n_1.translate)('privacy_heading_2'),
    (0, i18n_1.translate)('privacy_content_2'),
    (0, i18n_1.translate)('privacy_heading_3'),
    (0, i18n_1.translate)('privacy_heading_4'),
    (0, i18n_1.translate)('privacy_content_3'),
    (0, i18n_1.translate)('privacy_heading_5'),
    (0, i18n_1.translate)('privacy_content_4'),
    (0, i18n_1.translate)('privacy_content_5'),
    (0, i18n_1.translate)('privacy_content_6'),
    (0, i18n_1.translate)('privacy_content_7'),
    (0, i18n_1.translate)('privacy_content_8'),
    (0, i18n_1.translate)('privacy_content_9'),
    (0, i18n_1.translate)('privacy_content_10'),
    (0, i18n_1.translate)('privacy_heading_6'),
    (0, i18n_1.translate)('privacy_content_11'),
    (0, i18n_1.translate)('privacy_content_12'),
    (0, i18n_1.translate)('privacy_content_13'),
    (0, i18n_1.translate)('privacy_heading_7'),
    (0, i18n_1.translate)('privacy_content_14'),
    (0, i18n_1.translate)('privacy_content_15'),
    (0, i18n_1.translate)('privacy_heading_8'),
    (0, i18n_1.translate)('privacy_content_16'),
    (0, i18n_1.translate)('privacy_content_17'),
    (0, i18n_1.translate)('privacy_content_18'),
    (0, i18n_1.translate)('privacy_heading_9'),
    (0, i18n_1.translate)('privacy_content_19'),
    (0, i18n_1.translate)('privacy_content_20'),
    (0, i18n_1.translate)('privacy_content_21'),
    (0, i18n_1.translate)('privacy_heading_10'),
    (0, i18n_1.translate)('privacy_content_22'),
    (0, i18n_1.translate)('privacy_heading_11'),
    (0, i18n_1.translate)('privacy_content_23'),
    (0, i18n_1.translate)('privacy_content_24'),
    (0, i18n_1.translate)('privacy_content_25'),
    (0, i18n_1.translate)('privacy_content_26'),
    (0, i18n_1.translate)('privacy_heading_12'),
    (0, i18n_1.translate)('privacy_content_27'),
    (0, i18n_1.translate)('privacy_heading_13'),
    (0, i18n_1.translate)('privacy_content_28'),
    (0, i18n_1.translate)('privacy_content_29'),
];
exports.privacyScreenText = privacyScreenText;
const termsScreenText = () => [
    (0, i18n_1.translate)('arrow_button'),
    (0, i18n_1.translate)('terms'),
    (0, i18n_1.translate)('t_and_c_heading_1'),
    (0, i18n_1.translate)('t_and_c_heading_2'),
    (0, i18n_1.translate)('t_and_c_heading_3'),
    (0, i18n_1.translate)('t_and_c_content_1'),
    (0, i18n_1.translate)('t_and_c_content_2'),
    (0, i18n_1.translate)('t_and_c_heading_4'),
    (0, i18n_1.translate)('t_and_c_content_3'),
    (0, i18n_1.translate)('t_and_c_content_4'),
    (0, i18n_1.translate)('t_and_c_heading_5'),
    (0, i18n_1.translate)('t_and_c_content_5'),
    (0, i18n_1.translate)('t_and_c_heading_6'),
    (0, i18n_1.translate)('t_and_c_content_6'),
    (0, i18n_1.translate)('t_and_c_heading_7'),
    (0, i18n_1.translate)('t_and_c_content_7'),
    (0, i18n_1.translate)('t_and_c_heading_8'),
    (0, i18n_1.translate)('t_and_c_content_8'),
    (0, i18n_1.translate)('t_and_c_heading_9'),
    (0, i18n_1.translate)('t_and_c_content_9'),
    (0, i18n_1.translate)('t_and_c_heading_10'),
    (0, i18n_1.translate)('t_and_c_content_10'),
    (0, i18n_1.translate)('t_and_c_content_11'),
    (0, i18n_1.translate)('t_and_c_heading_11'),
    (0, i18n_1.translate)('t_and_c_content_12'),
    (0, i18n_1.translate)('t_and_c_heading_12'),
    (0, i18n_1.translate)('t_and_c_content_13'),
    (0, i18n_1.translate)('t_and_c_content_14'),
    (0, i18n_1.translate)('t_and_c_content_15'),
    (0, i18n_1.translate)('t_and_c_content_16'),
    (0, i18n_1.translate)('t_and_c_heading_13'),
    (0, i18n_1.translate)('t_and_c_content_17'),
    (0, i18n_1.translate)('t_and_c_content_18'),
    (0, i18n_1.translate)('t_and_c_heading_14'),
    (0, i18n_1.translate)('t_and_c_content_19'),
    (0, i18n_1.translate)('t_and_c_heading_15'),
    (0, i18n_1.translate)('t_and_c_content_20'),
    (0, i18n_1.translate)('t_and_c_heading_16'),
    (0, i18n_1.translate)('t_and_c_content_21'),
];
exports.termsScreenText = termsScreenText;
const encyclopediaScreenText = (categories) => {
    let textArray = [];
    categories.map((category) => (textArray = [...textArray, category.name, category.tags.primary.name]));
    return [
        (0, i18n_1.translate)('arrow_button'),
        (0, i18n_1.translate)('encyclopedia'),
        (0, i18n_1.translate)('text_input'),
        (0, i18n_1.translate)('clear_search'),
        ...textArray,
    ];
};
exports.encyclopediaScreenText = encyclopediaScreenText;
const contactUsScreenText = ({ isVisible }) => isVisible
    ? [(0, i18n_1.translate)('thank_you')]
    : [
        (0, i18n_1.translate)('arrow_button'),
        (0, i18n_1.translate)('contact_us'),
        (0, i18n_1.translate)('reason_text_input'),
        (0, i18n_1.translate)('green_btn_with_two_arrows'),
        (0, i18n_1.translate)('message_text_input'),
        (0, i18n_1.translate)('send'),
    ];
exports.contactUsScreenText = contactUsScreenText;
//# sourceMappingURL=speech.js.map