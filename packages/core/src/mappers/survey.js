"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSurveys = fromSurveys;
function fromSurveys(response) {
    const surveys = response.reduce((data, survey) => {
        return {
            byId: Object.assign(Object.assign({}, data.byId), { [survey.id]: {
                    id: survey.id,
                    question: survey.question,
                    response: survey.response,
                    answers: [
                        { text: survey.option1, emoji: '' },
                        { text: survey.option2, emoji: '' },
                        { text: survey.option3, emoji: '' },
                        { text: survey.option4, emoji: '' },
                        { text: survey.option5, emoji: '' },
                    ],
                } }),
            allIds: data.allIds.concat(survey.id),
        };
    }, { byId: {}, allIds: [] });
    return { surveys };
}
//# sourceMappingURL=survey.js.map