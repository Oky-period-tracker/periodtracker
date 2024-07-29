"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendEventsRequest = void 0;
const class_validator_1 = require("class-validator");
const eventsToIgnore = [
    'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE',
    'SCREEN_VIEWED',
    'CATEGORY_VIEWED',
    'SUBCATEGORY_VIEWED',
    'DAILY_CARD_USED',
];
class AppendEventsRequest {
    getEvents() {
        return this.events
            .filter((event) => !eventsToIgnore.includes(event.type)) // Stop saving these events to the DB
            .map((event) => {
            const { id: localId } = event, rest = __rest(event, ["id"]);
            return Object.assign({ localId }, rest);
        });
    }
}
exports.AppendEventsRequest = AppendEventsRequest;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AppendEventsRequest.prototype, "events", void 0);
//# sourceMappingURL=AppendEventsRequest.js.map