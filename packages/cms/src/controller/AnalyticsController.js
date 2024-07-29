"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const typeorm_1 = require("typeorm");
const Analytics_1 = require("../entity/Analytics");
class AnalyticsController {
    constructor() {
        this.analyticsRepository = (0, typeorm_1.getRepository)(Analytics_1.Analytics);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.analyticsRepository.find();
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const analyticsEntry = request.body;
            analyticsEntry.payload = request.body.payload ? request.body.payload : {};
            analyticsEntry.metadata = request.body.metadata ? request.body.metadata : {};
            yield this.analyticsRepository.save(analyticsEntry);
            return analyticsEntry;
        });
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=AnalyticsController.js.map