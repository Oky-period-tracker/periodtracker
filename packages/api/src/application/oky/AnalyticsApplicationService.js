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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsApplicationService = void 0;
const typedi_1 = require("typedi");
const AppEvent_1 = require("domain/oky/AppEvent");
const AppEventRepository_1 = require("domain/oky/AppEventRepository");
let AnalyticsApplicationService = class AnalyticsApplicationService {
    appendEvents(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, events }) {
            const appEvents = events.map((event) => {
                return AppEvent_1.AppEvent.fromData(userId, {
                    localId: event.localId,
                    type: event.type,
                    payload: event.payload,
                    metadata: event.metadata,
                });
            });
            return this.appEventRepository.appendEvents(appEvents);
        });
    }
    setRepository(repository) {
        this.appEventRepository = repository;
    }
};
exports.AnalyticsApplicationService = AnalyticsApplicationService;
__decorate([
    (0, typedi_1.Inject)(AppEventRepository_1.AppEventRepositoryToken),
    __metadata("design:type", typeof (_a = typeof AppEventRepository_1.AppEventRepository !== "undefined" && AppEventRepository_1.AppEventRepository) === "function" ? _a : Object)
], AnalyticsApplicationService.prototype, "appEventRepository", void 0);
exports.AnalyticsApplicationService = AnalyticsApplicationService = __decorate([
    (0, typedi_1.Service)()
], AnalyticsApplicationService);
//# sourceMappingURL=AnalyticsApplicationService.js.map