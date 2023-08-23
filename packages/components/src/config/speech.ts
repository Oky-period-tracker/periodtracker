import { translate } from '../i18n'
import moment from 'moment'
export const mainScreenSpeech = ({ data, wheelDaysInfo, todayInfo }) => {
  const infiniteDays = data.map((day: any) => [
    translate('day') + day.cycleDay.toString(),
    day.date.format('DD MMMM'),
    translate('mood'),
    translate('body'),
    translate('activity'),
    translate('flow'),
  ])

  return [
    translate('calendar'),
    translate('main_calendar_screen'),
    translate('calendar_shortcut'),
    translate('avatar'),
    translate('wheel_text'),
    ...wheelDaysInfo,
    todayInfo.cycleLength + translate('days'),
    todayInfo.onPeriod
      ? todayInfo.daysLeftOnPeriod.toString() + translate('left')
      : todayInfo.daysUntilNextPeriod.toString() + translate('to_go'),
    translate('large_day_card'),
    ...infiniteDays[0].flat(),
  ]
}

export const predictionChangeScreenSpeech = () => [
  translate('tutorial_launch_label'),
  translate('share_period_details_heading'),
  translate('user_input_instructions'),
  translate('prediction_change'),
  translate('period_start_cloud'),
  translate('period_day_cloud'),
  translate('no_period_day_cloud'),
]
export const spinLoaderSpeech = () => [translate('please_wait_tutorial')]
export const calendarScreenSpeech = ({
  opacity,
  isVisible,
  weekDays,
  monthDaysInfo,
  currentDay,
}) => {
  const check = moment(currentDay, 'YYYY/MM/DD')
  const month = check.format('MM')
  const day = check.format('D')
  const year = check.format('YYYY')
  const monthDate = moment(year + '-' + month, 'YYYY-MM')
  let daysInMonth = monthDate.daysInMonth()
  const arrDays = []

  while (daysInMonth) {
    const current = moment(currentDay).date(daysInMonth)
    arrDays.push(current.format('DD MMM'))
    daysInMonth--
  }
  const currenMonthDays = arrDays.reverse()
  if (isVisible && opacity === 0) return predictionChangeScreenSpeech()
  return isVisible
    ? [
        translate('daily_card_and_period_info'),
        translate('to_daily_card'),
        translate('change_period'),
      ]
    : [
        translate('arrow_button'),
        translate('calendar'),
        translate('previous_month'),
        `${currentDay.format('MMMM')} ${currentDay.format('YYYY')}`,
        translate('next_month'),
        ...weekDays,
        ...currenMonthDays,
      ]
}
export const profileScreenSpeech = ({
  currentUser,
  todayInfo,
  dateOfBirth,
  selectedAvatar,
  theme,
}) => [
  translate('arrow_button'),
  translate('profile'),
  translate('name'),
  currentUser.name,
  translate('age'),
  translate(dateOfBirth.format('MMM')) + ' ' + dateOfBirth.format('YYYY'),
  translate('gender'),
  translate(currentUser.gender),
  translate('green_btn_with_two_arrows'),
  translate('location'),
  translate(currentUser.location),
  translate('green_btn_with_two_arrows'),
  translate('cycle_length'),
  todayInfo.cycleLength.toString() + translate('days'),
  translate('period_length'),
  todayInfo?.periodLength?.toString() + translate('days'),
  translate(`selected_avatar`),
  translate(selectedAvatar),
  translate('selected_theme'),
  translate(theme),
]

export const settingsScreenText = ({ hasTtsActive }) => [
  translate('settings'),
  translate('about'),
  translate('about_info'),
  translate('t_and_c'),
  translate('t_and_c_info'),
  translate('privacy_policy'),
  translate('privacy_info'),
  translate('access_setting'),
  translate('settings_info'),
  translate('text_to_speech'),
  translate('text_to_speech_info'),
  `text to speech ${hasTtsActive ? 'on' : 'off'}`,
  translate('logout'),
  translate('delete_account_button'),
  translate('contact_us'),
]

export const acessSettingsScreenText = () => [
  translate('access_setting'),
  translate('tutorial'),
  translate('tutorial_subtitle'),
  translate('launch'),
  translate('share'),
  translate('share_qr_description'),
  translate('share_setting'),
]
export const aboutScreenText = () => [
  translate('arrow_button'),
  translate('about'),
  translate('about_content_1'),
  translate('about_heading_1'),
  translate('about_content_2'),
  translate('about_heading_2'),
  translate('about_content_3'),
  translate('about_content_4'),
  translate('about_content_5'),
  translate('about_heading_3'),
  translate('about_content_6'),
  translate('about_heading_4'),
  translate('about_content_7'),
  translate('about_heading_5'),
  translate('about_content_8'),
  translate('about_content_9'),
]

export const privacyScreenText = () => [
  translate('arrow_button'),
  translate('privacy_heading_1'),
  translate('privacy_content_1'),
  translate('privacy_heading_2'),
  translate('privacy_content_2'),
  translate('privacy_heading_3'),
  translate('privacy_heading_4'),
  translate('privacy_content_3'),
  translate('privacy_heading_5'),
  translate('privacy_content_4'),
  translate('privacy_content_5'),
  translate('privacy_content_6'),
  translate('privacy_content_7'),
  translate('privacy_content_8'),
  translate('privacy_content_9'),
  translate('privacy_content_10'),
  translate('privacy_heading_6'),
  translate('privacy_content_11'),
  translate('privacy_content_12'),
  translate('privacy_content_13'),
  translate('privacy_heading_7'),
  translate('privacy_content_14'),
  translate('privacy_content_15'),
  translate('privacy_heading_8'),
  translate('privacy_content_16'),
  translate('privacy_content_17'),
  translate('privacy_content_18'),
  translate('privacy_heading_9'),
  translate('privacy_content_19'),
  translate('privacy_content_20'),
  translate('privacy_content_21'),
  translate('privacy_heading_10'),
  translate('privacy_content_22'),
  translate('privacy_heading_11'),
  translate('privacy_content_23'),
  translate('privacy_content_24'),
  translate('privacy_content_25'),
  translate('privacy_content_26'),
  translate('privacy_heading_12'),
  translate('privacy_content_27'),
  translate('privacy_heading_13'),
  translate('privacy_content_28'),
  translate('privacy_content_29'),
]

export const termsScreenText = () => [
  translate('arrow_button'),
  translate('terms'),
  translate('t_and_c_heading_1'),
  translate('t_and_c_heading_2'),
  translate('t_and_c_heading_3'),
  translate('t_and_c_content_1'),
  translate('t_and_c_content_2'),
  translate('t_and_c_heading_4'),
  translate('t_and_c_content_3'),
  translate('t_and_c_content_4'),
  translate('t_and_c_heading_5'),
  translate('t_and_c_content_5'),
  translate('t_and_c_heading_6'),
  translate('t_and_c_content_6'),
  translate('t_and_c_heading_7'),
  translate('t_and_c_content_7'),
  translate('t_and_c_heading_8'),
  translate('t_and_c_content_8'),
  translate('t_and_c_heading_9'),
  translate('t_and_c_content_9'),
  translate('t_and_c_heading_10'),
  translate('t_and_c_content_10'),
  translate('t_and_c_content_11'),
  translate('t_and_c_heading_11'),
  translate('t_and_c_content_12'),
  translate('t_and_c_heading_12'),
  translate('t_and_c_content_13'),
  translate('t_and_c_content_14'),
  translate('t_and_c_content_15'),
  translate('t_and_c_content_16'),
  translate('t_and_c_heading_13'),
  translate('t_and_c_content_17'),
  translate('t_and_c_content_18'),
  translate('t_and_c_heading_14'),
  translate('t_and_c_content_19'),
  translate('t_and_c_heading_15'),
  translate('t_and_c_content_20'),
  translate('t_and_c_heading_16'),
  translate('t_and_c_content_21'),
]

export const encyclopediaScreenText = (categories) => {
  let textArray = []
  categories.map(
    (category: any) => (textArray = [...textArray, category.name, category.tags.primary.name]),
  )
  return [
    translate('arrow_button'),
    translate('encyclopedia'),
    translate('text_input'),
    translate('clear_search'),
    ...textArray,
  ]
}

export const contactUsScreenText = ({ isVisible }) =>
  isVisible
    ? [translate('thank_you')]
    : [
        translate('arrow_button'),
        translate('contact_us'),
        translate('reason_text_input'),
        translate('green_btn_with_two_arrows'),
        translate('message_text_input'),
        translate('send'),
      ]
