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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AnalyticsController = void 0;
const routing_controllers_1 = require("routing-controllers");
const AnalyticsApplicationService_1 = require("application/oky/AnalyticsApplicationService");
const AppendEventsRequest_1 = require("./requests/AppendEventsRequest");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsApplicationService) {
        this.analyticsApplicationService = analyticsApplicationService;
    }
    signup(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = request.getEvents();
            yield this.analyticsApplicationService.appendEvents({
                userId,
                events,
            });
            return { userId, events };
        });
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, routing_controllers_1.Post)('/append-events'),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: false })),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AppendEventsRequest_1.AppendEventsRequest]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "signup", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, routing_controllers_1.JsonController)('/analytics'),
    __metadata("design:paramtypes", [typeof (_a = typeof AnalyticsApplicationService_1.AnalyticsApplicationService !== "undefined" && AnalyticsApplicationService_1.AnalyticsApplicationService) === "function" ? _a : Object])
], AnalyticsController);
//# sourceMappingURL=AnalyticsController.js.map