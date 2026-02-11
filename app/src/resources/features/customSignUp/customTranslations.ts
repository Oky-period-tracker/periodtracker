import { Locale } from '../../translations'

type CustomSignUpTranslations = {
  // Accommodation requirements
  disability_question: string
  accommodation_error: string
  seeing: string
  hearing: string
  mobility: string
  self_care: string
  communication: string
  no_difficulty: string
  // Religion
  religion_question: string
  religion_error: string
  undisclosed_religion: string
  catholic: string
  islam: string
  born_again_christian: string
  iglesia_ni_cristo: string
  other_religion: string
  //
  encyclopedia_version_question: string
}

const en = {
  seeing: 'Vision (even with glasses)',
  hearing: 'Hearing (even if wearing a hearing aid)',
  mobility: 'Walking or climbing stairs',
  self_care: 'Self care (bathing, dressing)',
  communication: 'Communication (understanding or having your speech understood)',
  no_difficulty: 'I have no difficulty with them',
  your_gender: 'what is your gender',
  your_gender_identity: 'Are you a member of the LGBTIQ+ community?',
  disability_question: `Which task do you have difficulty with or can't do?`,
  religion_question: 'What is your religion?',
  encyclopedia_version_question: `Would you like to access some of Oky's informative content, such as an encyclopedia, did you know, and quizzes, with an Islamic perspective?`,
  religion_perspective_heading: 'Religion',
  religion_perspective_content: `By answering 'Islam', you will see the Encyclopedia that is according to the teachings of Islam`,
  islamic_perspective_heading: 'Disclaimer',
  islamic_perspective_content:
    'The informative content you will read has been consulted and validated by the Bangsamoro Darul-Ifta (BDI), the Ministry of Basic, Higher, and Technical Education (MBHTE), the Ministry of Health (MOH), and the Bangsamoro Youth Council ( BYC). Some of this information is according to Islamic teachings.',
  catholic: 'Catholic',
  islam: 'Islam',
  born_again_christian: 'Born Again Christian',
  iglesia_ni_cristo: 'church of Christ',
  other_religion: 'Other religion',
  undisclosed_religion: 'Prefer not to say',
  accommodation_error: 'Please select one',
  religion_error: 'Please select one',
}

const ph = {
  seeing: 'Paningin (kahit nakasuot ng salamin)',
  hearing: 'Pandinig (kahit nakasuot ng hearing aid)',
  mobility: 'Paglalakad o pag-akyat sa hagdan',
  self_care: 'Pag-aalaga sa sarili (pagligo, pagsuot ng damit)',
  communication: 'Pakikipag-usap (pag-intindi o naiintindihan ang iyong pananalita)',
  no_difficulty: 'Hindi ako nahihirapan sa mga ito',
  //
  your_gender: 'Ano ang kasarian mo?',
  your_gender_identity: 'Miyembro ka ba ng LGBTIQ+ community?',
  disability_question: 'Sa aling gawain ka nahihirapan o hindi mo kayang gawin?',
  religion_question: 'Ano ang iyong relihiyon?',
  encyclopedia_version_question:
    'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
  religion_perspective_heading: 'Relihiyon',
  religion_perspective_content:
    'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
  islamic_perspective_heading: 'Disclaimer',
  islamic_perspective_content:
    'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  catholic: 'Katoliko',
  islam: 'Islam',
  born_again_christian: 'Born Again Christian',
  iglesia_ni_cristo: 'Iglesia ni Cristo',
  other_religion: 'Iba',
  undisclosed_religion: 'Hindi ko gustong ilagay',
  accommodation_error: 'Please select one',
  religion_error: 'Please select one',
}

export const customSignUpTranslations: Record<Locale, CustomSignUpTranslations> = {
  en,
  es: ph,
  fr: ph,
  pt: ph,
  ru: ph,
}
