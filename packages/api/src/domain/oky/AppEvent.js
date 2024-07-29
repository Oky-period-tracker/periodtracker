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
var AppEvent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEvent = void 0;
const typeorm_1 = require("typeorm");
let AppEvent = AppEvent_1 = class AppEvent {
    static fromData(userId, { localId, type, payload, metadata, }) {
        if (!localId) {
            throw new Error(`Event local id must not be empty`);
        }
        if (!type) {
            throw new Error(`Event type must not be empty`);
        }
        if (!payload || typeof payload !== 'object') {
            throw new Error(`Event payload must be an object`);
        }
        if (!metadata || typeof metadata !== 'object') {
            throw new Error(`Event metadata must be an object`);
        }
        const appEvent = new AppEvent_1();
        appEvent.localId = localId;
        appEvent.type = type;
        appEvent.payload = payload;
        appEvent.metadata = metadata;
        appEvent.userId = userId;
        return appEvent;
    }
};
exports.AppEvent = AppEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AppEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'local_id', unique: true }),
    __metadata("design:type", String)
], AppEvent.prototype, "localId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type' }),
    __metadata("design:type", String)
], AppEvent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payload', type: 'json' }),
    __metadata("design:type", Object)
], AppEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metadata', type: 'json' }),
    __metadata("design:type", Object)
], AppEvent.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], AppEvent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AppEvent.prototype, "createdAt", void 0);
exports.AppEvent = AppEvent = AppEvent_1 = __decorate([
    (0, typeorm_1.Entity)()
], AppEvent);
//# sourceMappingURL=AppEvent.js.map