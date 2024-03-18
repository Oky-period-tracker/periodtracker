import { Locale } from '@oky/core'
import { CustomComponentsTranslations } from './types'

type AllowExtra<T> = T & { [key: string]: any }

type CustomTranslationsData = AllowExtra<Record<Locale, CustomComponentsTranslations>>

export const customComponentsTranslations: CustomTranslationsData = {
  en: {
    seeing: 'Paningin (kahit nakasuot ng salamin)',
    hearing: 'Pandinig (kahit nakasuot ng hearing aid)',
    mobility: 'Paglalakad o pag-akyat sa hagdan',
    self_care: 'Pag-aalaga sa sarili (pagligo, pagsuot ng damit)',
    communication: 'Pakikipag-usap (pag-intindi o naiintindihan ang iyong pananalita)',
    no_difficulty: 'Hindi ako nahihirapan sa mga ito',
    your_gender: 'Ano ang kasarian mo?',
    your_gender_identity: 'Miyembro ka ba ng LGBTIQ+ community?',
    disability_question: 'Sa aling gawain ka nahihirapan o hindi mo kayang gawin?',
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
  ph: {
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
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
  es: {
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
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
  fr: {
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
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
  pt: {
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
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
  ru: {
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
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
}
