"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asUTC = asUTC;
exports.asLocal = asLocal;
exports.toShortISO = toShortISO;
exports.calculateAge = calculateAge;
exports.toAge = toAge;
const moment_1 = __importDefault(require("moment"));
function asUTC(time) {
    if (time.isValid() && !time.isUTC()) {
        return time.clone().utc();
    }
    return time;
}
function asLocal(time) {
    if (time.isValid() && !time.isLocal()) {
        return time.clone().local();
    }
    return time;
}
function toShortISO(time) {
    return time.format('YYYYMMDD');
}
function calculateAge(birthday) {
    const diffDuration = moment_1.default.duration((0, moment_1.default)().diff(birthday));
    return {
        years: diffDuration.years(),
        months: diffDuration.months(),
    };
}
function toAge(birthday) {
    const { years } = calculateAge(birthday);
    return years;
}
//# sourceMappingURL=dateUtils.js.map