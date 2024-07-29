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
exports.HelpCenter = void 0;
const typeorm_1 = require("typeorm");
let HelpCenter = class HelpCenter {
};
exports.HelpCenter = HelpCenter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HelpCenter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "contactOne", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "contactTwo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpCenter.prototype, "lang", void 0);
exports.HelpCenter = HelpCenter = __decorate([
    (0, typeorm_1.Entity)()
], HelpCenter);
//# sourceMappingURL=HelpCenter.js.map