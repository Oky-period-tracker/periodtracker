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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidYouKnow = void 0;
const typeorm_1 = require("typeorm");
let DidYouKnow = class DidYouKnow {
};
exports.DidYouKnow = DidYouKnow;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], DidYouKnow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DidYouKnow.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DidYouKnow.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], DidYouKnow.prototype, "isAgeRestricted", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], DidYouKnow.prototype, "live", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DidYouKnow.prototype, "lang", void 0);
exports.DidYouKnow = DidYouKnow = __decorate([
    (0, typeorm_1.Entity)()
], DidYouKnow);
//# sourceMappingURL=DidYouKnow.js.map