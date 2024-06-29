import { Locale } from '.'

type Country = Record<Locale, string>

export const countries: Record<string, Country> = {
  AF: { en: 'Afghanistan', ph: 'Afghanistan' },
  AL: { en: 'Albania', ph: 'Albania' },
  DZ: { en: 'Algeria', ph: 'Algeria' },
  AS: { en: 'American Samoa', ph: 'American Samoa' },
  AD: { en: 'Andorra', ph: 'Andorra' },
  AO: { en: 'Angola', ph: 'Angola' },
  AI: { en: 'Anguilla', ph: 'Anguilla' },
  AQ: { en: 'Antarctica', ph: 'Antarctica' },
  AG: { en: 'Antigua and Barbuda', ph: 'Antigua and Barbuda' },
  AR: { en: 'Argentina', ph: 'Argentina' },
  AM: { en: 'Armenia', ph: 'Armenia' },
  AW: { en: 'Aruba', ph: 'Aruba' },
  AU: { en: 'Australia', ph: 'Australia' },
  AT: { en: 'Austria', ph: 'Austria' },
  AZ: { en: 'Azerbaijan', ph: 'Azerbaijan' },
  BS: { en: 'Bahamas', ph: 'Bahamas' },
  BH: { en: 'Bahrain', ph: 'Bahrain' },
  BD: { en: 'Bangladesh', ph: 'Bangladesh' },
  BB: { en: 'Barbados', ph: 'Barbados' },
  BY: { en: 'Belarus', ph: 'Belarus' },
  BE: { en: 'Belgium', ph: 'Belgium' },
  BZ: { en: 'Belize', ph: 'Belize' },
  BJ: { en: 'Benin', ph: 'Benin' },
  BM: { en: 'Bermuda', ph: 'Bermuda' },
  BT: { en: 'Bhutan', ph: 'Bhutan' },
  BO: { en: 'Bolivia ', ph: 'Bolivia ' },
  BQ: { en: 'Bonaire', ph: 'Bonaire' },
  BA: { en: 'Bosnia and Herzegovina', ph: 'Bosnia and Herzegovina' },
  BW: { en: 'Botswana', ph: 'Botswana' },
  BV: { en: 'Bouvet Island', ph: 'Bouvet Island' },
  BR: { en: 'Brazil', ph: 'Brazil' },
  IO: { en: 'British Indian Ocean Ter', ph: 'British Indian Ocean Ter' },
  VG: { en: 'British Virgin Islands', ph: 'British Virgin Islands' },
  BN: { en: 'Brunei Darussalam', ph: 'Brunei Darussalam' },
  BG: { en: 'Bulgaria', ph: 'Bulgaria' },
  BF: { en: 'Burkina Faso', ph: 'Burkina Faso' },
  BI: { en: 'Burundi', ph: 'Burundi' },
  KH: { en: 'Cambodia', ph: 'Cambodia' },
  CM: { en: 'Cameroon', ph: 'Cameroon' },
  CA: { en: 'Canada', ph: 'Canada' },
  CV: { en: 'Cape Verde', ph: 'Cape Verde' },
  KY: { en: 'Cayman Islands', ph: 'Cayman Islands' },
  CF: { en: 'Central African Republic', ph: 'Central African Republic' },
  TD: { en: 'Chad', ph: 'Chad' },
  CL: { en: 'Chile', ph: 'Chile' },
  CN: { en: 'China', ph: 'China' },
  CX: { en: 'Christmas Island', ph: 'Christmas Island' },
  CC: { en: 'Cocos [Keeling] Islands', ph: 'Cocos [Keeling] Islands' },
  CO: { en: 'Colombia', ph: 'Colombia' },
  KM: { en: 'Comoros', ph: 'Comoros' },
  CK: { en: 'Cook Islands', ph: 'Cook Islands' },
  CR: { en: 'Costa Rica', ph: 'Costa Rica' },
  HR: { en: 'Croatia', ph: 'Croatia' },
  CU: { en: 'Cuba', ph: 'Cuba' },
  CW: { en: 'Curacao', ph: 'Curacao' },
  CY: { en: 'Cyprus', ph: 'Cyprus' },
  CZ: { en: 'Czech Republic', ph: 'Czech Republic' },
  CD: { en: 'Democratic Republic of Congo', ph: 'Democratic Republic of Congo' },
  DK: { en: 'Denmark', ph: 'Denmark' },
  DJ: { en: 'Djibouti', ph: 'Djibouti' },
  DM: { en: 'Dominica', ph: 'Dominica' },
  DO: { en: 'Dominican Republic', ph: 'Dominican Republic' },
  TL: { en: 'Timor-Leste', ph: 'Timor-Leste' },
  EC: { en: 'Ecuador', ph: 'Ecuador' },
  EG: { en: 'Egypt', ph: 'Egypt' },
  SV: { en: 'El Salvador', ph: 'El Salvador' },
  GQ: { en: 'Equatorial Guinea', ph: 'Equatorial Guinea' },
  ER: { en: 'Eritrea', ph: 'Eritrea' },
  EE: { en: 'Estonia', ph: 'Estonia' },
  ET: { en: 'Ethiopia', ph: 'Ethiopia' },
  FK: { en: 'Falkland Islands', ph: 'Falkland Islands' },
  FO: { en: 'Faroe Islands', ph: 'Faroe Islands' },
  FJ: { en: 'Fiji', ph: 'Fiji' },
  FI: { en: 'Finland', ph: 'Finland' },
  FR: { en: 'France', ph: 'France' },
  GF: { en: 'French Guiana', ph: 'French Guiana' },
  PF: { en: 'French Polynesia', ph: 'French Polynesia' },
  TF: { en: 'French Southern Territor', ph: 'French Southern Territor' },
  GA: { en: 'Gabon', ph: 'Gabon' },
  GM: { en: 'Gambia', ph: 'Gambia' },
  GE: { en: 'Georgia', ph: 'Georgia' },
  DE: { en: 'Germany', ph: 'Germany' },
  GH: { en: 'Ghana', ph: 'Ghana' },
  GI: { en: 'Gibraltar', ph: 'Gibraltar' },
  GR: { en: 'Greece', ph: 'Greece' },
  GL: { en: 'Greenland', ph: 'Greenland' },
  GD: { en: 'Grenada', ph: 'Grenada' },
  GP: { en: 'Guadeloupe', ph: 'Guadeloupe' },
  GU: { en: 'Guam', ph: 'Guam' },
  GT: { en: 'Guatemala', ph: 'Guatemala' },
  GG: { en: 'Guernsey', ph: 'Guernsey' },
  GN: { en: 'Guinea', ph: 'Guinea' },
  GW: { en: 'Guinea-Bissau', ph: 'Guinea-Bissau' },
  GY: { en: 'Guyana', ph: 'Guyana' },
  HT: { en: 'Haiti', ph: 'Haiti' },
  HM: { en: 'Heard Island and McDonal', ph: 'Heard Island and McDonal' },
  HN: { en: 'Honduras', ph: 'Honduras' },
  HK: { en: 'Hong Kong', ph: 'Hong Kong' },
  HU: { en: 'Hungary', ph: 'Hungary' },
  IS: { en: 'Iceland', ph: 'Iceland' },
  IN: { en: 'India', ph: 'India' },
  ID: { en: 'Indonesia', ph: 'Indonesia' },
  IR: { en: 'Iran', ph: 'Iran' },
  IQ: { en: 'Iraq', ph: 'Iraq' },
  IE: { en: 'Ireland', ph: 'Ireland' },
  IM: { en: 'Isle of Man', ph: 'Isle of Man' },
  IL: { en: 'Israel', ph: 'Israel' },
  IT: { en: 'Italy', ph: 'Italy' },
  CI: { en: 'Ivory Coast', ph: 'Ivory Coast' },
  JM: { en: 'Jamaica', ph: 'Jamaica' },
  JP: { en: 'Japan', ph: 'Japan' },
  JE: { en: 'Jersey', ph: 'Jersey' },
  JO: { en: 'Jordan', ph: 'Jordan' },
  KZ: { en: 'Kazakhstan', ph: 'Kazakhstan' },
  KE: { en: 'Kenya', ph: 'Kenya' },
  KI: { en: 'Kiribati', ph: 'Kiribati' },
  XK: { en: 'Kosovo', ph: 'Kosovo' },
  KW: { en: 'Kuwait', ph: 'Kuwait' },
  KG: { en: 'Kyrgyzstan', ph: 'Kyrgyzstan' },
  LA: { en: 'Laos', ph: 'Laos' },
  LV: { en: 'Latvia', ph: 'Latvia' },
  LB: { en: 'Lebanon', ph: 'Lebanon' },
  LS: { en: 'Lesotho', ph: 'Lesotho' },
  LR: { en: 'Liberia', ph: 'Liberia' },
  LY: { en: 'Libya', ph: 'Libya' },
  LI: { en: 'Liechtenstein', ph: 'Liechtenstein' },
  LT: { en: 'Lithuania', ph: 'Lithuania' },
  LU: { en: 'Luxembourg', ph: 'Luxembourg' },
  MO: { en: 'Macao', ph: 'Macao' },
  MG: { en: 'Madagascar', ph: 'Madagascar' },
  MW: { en: 'Malawi', ph: 'Malawi' },
  MY: { en: 'Malaysia', ph: 'Malaysia' },
  MV: { en: 'Maldives', ph: 'Maldives' },
  ML: { en: 'Mali', ph: 'Mali' },
  MT: { en: 'Malta', ph: 'Malta' },
  MH: { en: 'Marshall Islands', ph: 'Marshall Islands' },
  MQ: { en: 'Martinique', ph: 'Martinique' },
  MR: { en: 'Mauritania', ph: 'Mauritania' },
  MU: { en: 'Mauritius', ph: 'Mauritius' },
  YT: { en: 'Mayotte', ph: 'Mayotte' },
  MX: { en: 'Mexico', ph: 'Mexico' },
  FM: { en: 'Micronesia', ph: 'Micronesia' },
  MD: { en: 'Moldova', ph: 'Moldova' },
  MC: { en: 'Monaco', ph: 'Monaco' },
  MN: { en: 'Mongolia', ph: 'Mongolia' },
  ME: { en: 'Montenegro', ph: 'Montenegro' },
  MS: { en: 'Montserrat', ph: 'Montserrat' },
  MA: { en: 'Morocco', ph: 'Morocco' },
  MZ: { en: 'Mozambique', ph: 'Mozambique' },
  MM: { en: 'Myanmar [Burma]', ph: 'Myanmar [Burma]' },
  NA: { en: 'Namibia', ph: 'Namibia' },
  NR: { en: 'Nauru', ph: 'Nauru' },
  NP: { en: 'Nepal', ph: 'Nepal' },
  NL: { en: 'Netherlands', ph: 'Netherlands' },
  NC: { en: 'New Caledonia', ph: 'New Caledonia' },
  NZ: { en: 'New Zealand', ph: 'New Zealand' },
  NI: { en: 'Nicaragua', ph: 'Nicaragua' },
  NE: { en: 'Niger', ph: 'Niger' },
  NG: { en: 'Nigeria', ph: 'Nigeria' },
  NU: { en: 'Niue', ph: 'Niue' },
  NF: { en: 'Norfolk Island', ph: 'Norfolk Island' },
  KP: { en: 'North Korea', ph: 'North Korea' },
  MK: { en: 'North Macedonia', ph: 'North Macedonia' },
  MP: { en: 'Northern Mariana Islands', ph: 'Northern Mariana Islands' },
  NO: { en: 'Norway', ph: 'Norway' },
  OM: { en: 'Oman', ph: 'Oman' },
  PK: { en: 'Pakistan', ph: 'Pakistan' },
  PW: { en: 'Palau', ph: 'Palau' },
  PS: { en: 'State of Palestine', ph: 'State of Palestine' },
  PA: { en: 'Panama', ph: 'Panama' },
  PG: { en: 'Papua New Guinea', ph: 'Papua New Guinea' },
  PY: { en: 'Paraguay', ph: 'Paraguay' },
  PE: { en: 'Peru', ph: 'Peru' },
  PH: { en: 'Philippines', ph: 'Philippines' },
  PN: { en: 'Pitcairn Islands', ph: 'Pitcairn Islands' },
  PL: { en: 'Poland', ph: 'Poland' },
  PT: { en: 'Portugal', ph: 'Portugal' },
  PR: { en: 'Puerto Rico', ph: 'Puerto Rico' },
  QA: { en: 'Qatar', ph: 'Qatar' },
  CG: { en: 'Republic of the Congo', ph: 'Republic of the Congo' },
  RO: { en: 'Romania', ph: 'Romania' },
  RU: { en: 'Russia', ph: 'Russia' },
  RW: { en: 'Rwanda', ph: 'Rwanda' },
  RE: { en: 'Réunion', ph: 'Réunion' },
  BL: { en: 'Saint Barthélemy', ph: 'Saint Barthélemy' },
  SH: { en: 'Saint Helena', ph: 'Saint Helena' },
  KN: { en: 'Saint Kitts and Nevis', ph: 'Saint Kitts and Nevis' },
  LC: { en: 'Saint Lucia', ph: 'Saint Lucia' },
  MF: { en: 'Saint Martin', ph: 'Saint Martin' },
  PM: { en: 'Saint Pierre and Miquelo', ph: 'Saint Pierre and Miquelo' },
  VC: { en: 'Saint Vincent and the Gr', ph: 'Saint Vincent and the Gr' },
  WS: { en: 'Samoa', ph: 'Samoa' },
  SM: { en: 'San Marino', ph: 'San Marino' },
  SA: { en: 'Saudi Arabia', ph: 'Saudi Arabia' },
  SN: { en: 'Senegal', ph: 'Senegal' },
  RS: { en: 'Serbia', ph: 'Serbia' },
  SC: { en: 'Seychelles', ph: 'Seychelles' },
  SL: { en: 'Sierra Leone', ph: 'Sierra Leone' },
  SG: { en: 'Singapore', ph: 'Singapore' },
  SX: { en: 'Sint Maarten', ph: 'Sint Maarten' },
  SK: { en: 'Slovakia', ph: 'Slovakia' },
  SI: { en: 'Slovenia', ph: 'Slovenia' },
  SB: { en: 'Solomon Islands', ph: 'Solomon Islands' },
  SO: { en: 'Somalia', ph: 'Somalia' },
  ZA: { en: 'South Africa', ph: 'South Africa' },
  KR: { en: 'South Korea', ph: 'South Korea' },
  SS: { en: 'South Sudan', ph: 'South Sudan' },
  ES: { en: 'Spain', ph: 'Spain' },
  LK: { en: 'Sri Lanka', ph: 'Sri Lanka' },
  SD: { en: 'Sudan', ph: 'Sudan' },
  SR: { en: 'Suriname', ph: 'Suriname' },
  SJ: { en: 'Svalbard and Jan Mayen', ph: 'Svalbard and Jan Mayen' },
  SZ: { en: 'Swaziland', ph: 'Swaziland' },
  SE: { en: 'Sweden', ph: 'Sweden' },
  CH: { en: 'Switzerland', ph: 'Switzerland' },
  SY: { en: 'Syrian Arab Republic', ph: 'Syrian Arab Republic' },
  ST: { en: 'São Tomé and Príncipe', ph: 'São Tomé and Príncipe' },
  TW: { en: 'Taiwan', ph: 'Taiwan' },
  TJ: { en: 'Tajikistan', ph: 'Tajikistan' },
  TZ: { en: 'Tanzania', ph: 'Tanzania' },
  TH: { en: 'Thailand', ph: 'Thailand' },
  TG: { en: 'Togo', ph: 'Togo' },
  TK: { en: 'Tokelau', ph: 'Tokelau' },
  TO: { en: 'Tonga', ph: 'Tonga' },
  TT: { en: 'Trinidad and Tobago', ph: 'Trinidad and Tobago' },
  TN: { en: 'Tunisia', ph: 'Tunisia' },
  TR: { en: 'Turkey', ph: 'Turkey' },
  TM: { en: 'Turkmenistan', ph: 'Turkmenistan' },
  TC: { en: 'Turks and Caicos Islands', ph: 'Turks and Caicos Islands' },
  TV: { en: 'Tuvalu', ph: 'Tuvalu' },
  UM: { en: 'U.S. Minor Outlying Isla', ph: 'U.S. Minor Outlying Isla' },
  VI: { en: 'U.S. Virgin Islands', ph: 'U.S. Virgin Islands' },
  UG: { en: 'Uganda', ph: 'Uganda' },
  UA: { en: 'Ukraine', ph: 'Ukraine' },
  AE: { en: 'United Arab Emirates', ph: 'United Arab Emirates' },
  GB: { en: 'United Kingdom', ph: 'United Kingdom' },
  US: { en: 'United States of America', ph: 'United States of America' },
  UY: { en: 'Uruguay', ph: 'Uruguay' },
  UZ: { en: 'Uzbekistan', ph: 'Uzbekistan' },
  VU: { en: 'Vanuatu', ph: 'Vanuatu' },
  VA: { en: 'Vatican City', ph: 'Vatican City' },
  VE: { en: 'Venezuela', ph: 'Venezuela' },
  VN: { en: 'Vietnam', ph: 'Vietnam' },
  WF: { en: 'Wallis and Futuna', ph: 'Wallis and Futuna' },
  EH: { en: 'Western Sahara', ph: 'Western Sahara' },
  YE: { en: 'Yemen', ph: 'Yemen' },
  ZM: { en: 'Zambia', ph: 'Zambia' },
  ZW: { en: 'Zimbabwe', ph: 'Zimbabwe' },
  AX: { en: 'Åland', ph: 'Åland' },
}