"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDidYouKnows = fromDidYouKnows;
const uuid_1 = require("uuid");
function fromDidYouKnows(response) {
    const didYouKnows = response.reduce((data, didyouknow) => {
        const id = (0, uuid_1.v4)();
        return {
            byId: Object.assign(Object.assign({}, data.byId), { [id]: {
                    id,
                    isAgeRestricted: didyouknow.isAgeRestricted,
                    title: didyouknow.title,
                    content: didyouknow.content,
                } }),
            allIds: data.allIds.concat(id),
        };
    }, { byId: {}, allIds: [] });
    return { didYouKnows };
}
//# sourceMappingURL=didyouknow.js.map