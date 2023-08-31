import fs from 'fs'

const routes = [
  // ------------ Render ----------------
  {
    method: 'get',
    route: '/login',

    action: 'renderLogin',
  },
  {
    method: 'get',
    route: '/encyclopedia',

    action: 'renderEncyclopedia',
  },
  {
    method: 'get',
    route: '/quiz-management',

    action: 'renderQuiz',
  },
  {
    method: 'get',
    route: '/didyouknow-management',

    action: 'renderDidYouKnow',
  },
  {
    method: 'get',
    route: '/user-management',

    action: 'renderUserManagement',
  },
  {
    method: 'get',
    route: '/catsubcat-management',

    action: 'renderCatSubcatManagement',
  },
  {
    method: 'get',
    route: '/survey-management',

    action: 'renderSurvey',
  },
  {
    method: 'get',
    route: '/answered-surveys',

    action: 'renderAnsweredSurvey',
  },
  {
    method: 'get',
    route: '/suggestions-management',

    action: 'renderSuggestion',
  },
  {
    method: 'get',
    route: '/notifications-management',

    action: 'renderNotification',
  },
  {
    method: 'get',
    route: '/help-center-management',

    action: 'renderHelpCenter',
  },
  {
    method: 'get',
    route: '/about-management',

    action: 'renderAbout',
  },
  {
    method: 'get',
    route: '/terms-and-conditions-management',

    action: 'renderTermsAndConditions',
  },
  {
    method: 'get',
    route: '/privacy-policy-management',

    action: 'renderPrivacyPolicy',
  },
  {
    method: 'get',
    route: '/analytics-management',

    action: 'renderAnalytics',
  },
  {
    method: 'get',
    route: '/avatar-message-management',

    action: 'renderAvatarMessages',
  },
  // ------------ Access ----------------
  {
    method: 'get',
    route: '/logout',

    action: 'logout',
  },
  {
    method: 'post',
    route: '/login',

    action: 'login',
  },
  {
    method: 'post',
    route: '/register',

    action: 'register',
  },
  // ------------ Analytics ----------------
  {
    method: 'post',
    route: '/analytics/events',

    action: 'save',
  },
  // ------------ Articles Api ----------------
  {
    method: 'get',
    route: '/articles',

    action: 'all',
  },
  {
    method: 'get',
    route: '/articles/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/articles',

    action: 'save',
  },
  {
    method: 'put',
    route: '/articles/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/articles/:id',

    action: 'remove',
  },
  // ------------ Categories Api ----------------
  {
    method: 'get',
    route: '/categories',

    action: 'all',
  },
  {
    method: 'get',
    route: '/categories/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/categories',

    action: 'save',
  },
  {
    method: 'put',
    route: '/categories/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/categories/:id',

    action: 'remove',
  },
  // ------------ Subcategories Api ----------------
  {
    method: 'get',
    route: '/subcategories',

    action: 'all',
  },
  {
    method: 'get',
    route: '/subcategories/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/subcategories',

    action: 'save',
  },
  {
    method: 'put',
    route: '/subcategories/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/subcategories/:id',

    action: 'remove',
  },
  // ------------ Quizzes Api ----------------
  {
    method: 'get',
    route: '/quiz',

    action: 'all',
  },
  {
    method: 'get',
    route: '/quiz/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/quiz',

    action: 'save',
  },
  {
    method: 'put',
    route: '/quiz/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/quiz/:id',

    action: 'remove',
  },
  // ------------ Users Api ----------------
  {
    method: 'get',
    route: '/user',

    action: 'all',
  },
  {
    method: 'get',
    route: '/user/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/user',

    action: 'save',
  },
  {
    method: 'put',
    route: '/user/change-location/',

    action: 'changeLocation',
  },
  {
    method: 'put',
    route: '/user/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/user/:id',

    action: 'remove',
  },
  // ------------ Avatar Messages ----------------
  {
    method: 'get',
    route: '/avatar-message',

    action: 'all',
  },
  {
    method: 'get',
    route: '/avatar-message/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/avatar-message',

    action: 'save',
  },
  {
    method: 'put',
    route: '/avatar-message/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/avatar-message/:id',

    action: 'remove',
  },
  // ------------ Did You Know Api ----------------
  {
    method: 'get',
    route: '/avatar-message',

    action: 'all',
  },
  {
    method: 'get',
    route: '/didyouknow/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/didyouknow',

    action: 'save',
  },
  {
    method: 'put',
    route: '/didyouknow/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/didyouknow/:id',

    action: 'remove',
  },
  // ------------ Help Center Api ----------------
  {
    method: 'get',
    route: '/help-center',

    action: 'all',
  },
  {
    method: 'get',
    route: '/help-center/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/help-center',

    action: 'save',
  },
  {
    method: 'put',
    route: '/help-center/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/help-center/:id',

    action: 'remove',
  },

  // ------------ Privacy Policy Api ----------------
  {
    method: 'get',
    route: '/privacy-policy',

    action: 'all',
  },
  {
    method: 'get',
    route: '/privacy-policy/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/privacy-policy',

    action: 'save',
  },
  {
    method: 'put',
    route: '/privacy-policy/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/privacy-policy/:id',

    action: 'remove',
  },
  // ------------ Terms and Condition Api ----------------
  {
    method: 'get',
    route: '/terms-and-conditions',

    action: 'all',
  },
  {
    method: 'get',
    route: '/terms-and-conditions/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/terms-and-conditions',

    action: 'save',
  },
  {
    method: 'put',
    route: '/terms-and-conditions/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/terms-and-conditions/:id',

    action: 'remove',
  },
  // ------------ About Api ----------------
  {
    method: 'get',
    route: '/about',

    action: 'all',
  },
  {
    method: 'get',
    route: '/about/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/about',

    action: 'save',
  },
  {
    method: 'put',
    route: '/about/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/about/:id',

    action: 'remove',
  },
  // ------------ About Banner Api ----------------
  {
    method: 'post',
    route: '/about-banner-management',

    action: 'saveOrUpdate',
  },
  {
    method: 'delete',
    route: '/about-banner-management/:id',

    action: 'remove',
  },
  // ------------ Survey Api ----------------
  {
    method: 'get',
    route: '/survey',

    action: 'all',
  },
  {
    method: 'get',
    route: '/survey/:id',

    action: 'one',
  },
  {
    method: 'post',
    route: '/survey',

    action: 'save',
  },
  {
    method: 'put',
    route: '/survey/:id',

    action: 'update',
  },
  {
    method: 'delete',
    route: '/survey/:id',

    action: 'remove',
  },
  // ------------ exposed Api ----------------
  {
    method: 'get',
    route: '/mobile/articles/:lang',

    action: 'mobileArticlesByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/avatar-messages/:lang',

    action: 'mobileAvatarMessagesByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/quizzes/:lang',

    action: 'mobileQuizzesByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/didyouknows/:lang',

    action: 'mobileDidYouKnowByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/surveys/:lang',

    action: 'mobileSurveysByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/new-surveys/:lang',

    action: 'newMobileSurveysByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/notification/:lang',

    action: 'mobileNotificationsByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/help-center/:lang',

    action: 'mobileHelpCenterByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/privacy-policy/:lang',

    action: 'mobilePrivacyPolicyByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/terms-and-conditions/:lang',

    action: 'mobileTermsAndConditionsByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/about/:lang',

    action: 'mobileAboutByLanguage',
  },
  {
    method: 'get',
    route: '/mobile/about-banner/:lang',

    action: 'mobileAboutBannerByLanguage',
  },

  // ------- suggestion Api -------
  {
    method: 'get',
    route: '/suggestions',

    action: 'all',
  },
  {
    method: 'post',
    route: '/toggle-suggestions-status',

    action: 'updateStatus',
  },
  {
    method: 'delete',
    route: '/suggestions/:id',

    action: 'remove',
  },
  {
    method: 'post',
    route: '/mobile/suggestions',

    action: 'save',
  },
  {
    method: 'get',
    route: '/mobile/permanent-notification/:ver&:lang&:user',

    action: 'mobilePermanentNotifications',
  },
  // ------- Notification api -------
  {
    method: 'post',
    route: '/notification',

    action: 'save',
  },
  {
    method: 'post',
    route: '/permanent-alert',

    action: 'savePermanentAlert',
  },
  {
    method: 'put',
    route: '/permanent-alert/:id',

    action: 'updatePermanentAlert',
  },
  {
    method: 'delete',
    route: '/permanent-alert/:id',

    action: 'removePermanentAlert',
  },
  {
    method: 'delete',
    route: '/notification/:id',

    action: 'remove',
  },
  // ------- Data api -------
  {
    method: 'get',
    route: '/data',

    action: 'renderDataManagement',
  },
  {
    method: 'get',
    route: '/data/generate-content-ts',

    action: 'generateContentTs',
  },
  {
    method: 'get',
    route: '/data/generate-content-sheet',

    action: 'generateContentSheet',
  },
  {
    method: 'get',
    route: '/data/generate-app-translations-sheet',

    action: 'generateAppTranslationsSheet',
  },
  {
    method: 'get',
    route: '/data/generate-cms-translations-sheet',

    action: 'generateCmsTranslationsSheet',
  },
]

const createMdString = (method, route, action) => {
  if (action.includes('render')) {
    return `
## ${route}

Method: ${method}
URL: ${route}
Response: HTML page

---

  `
  }

  return `

## ${route}

Method: ${method}
URL: ${route}
Parameters:

| Name  | Type | Required | Description |
|-----------|-----------|-----------|-----------|
| |  | | |

${
  method !== 'GET'
    ? `
Request Body:
\`\`\`json
{
    "key": "value"  
}
\`\`\`
  `
    : ''
}

Response:
_Success:_
Status Code: 200
Response Body:

\`\`\`json
{
  "key": "value"
}
\`\`\`

_Failure:_
Status Code: 400
Response Body:
json
Copy code

\`\`\`json
{
  "error": "Description of the error"
}
\`\`\`

---
`
}

let fileContent = ''

routes.forEach((route) => {
  fileContent += createMdString(route.method, route.route, route.action)
})

fs.writeFileSync('api.md', fileContent)
