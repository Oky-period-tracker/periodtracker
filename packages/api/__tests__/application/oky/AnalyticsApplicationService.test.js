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
const AnalyticsApplicationService_1 = require("../../../src/application/oky/AnalyticsApplicationService");
const AppEvent_1 = require("../../../src/domain/oky/AppEvent");
const mockAppendEvents = jest.fn();
const mockAppEventRepository = {
    appendEvents: mockAppendEvents,
};
describe('AnalyticsApplicationService', () => {
    let service;
    beforeEach(() => {
        service = new AnalyticsApplicationService_1.AnalyticsApplicationService();
        service.setRepository(mockAppEventRepository);
    });
    it('should append events correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const command = {
            userId: 'user1',
            events: [
                {
                    localId: 'local1',
                    type: 'type1',
                    payload: {},
                    metadata: {},
                },
            ],
        };
        yield service.appendEvents(command);
        expect(mockAppendEvents).toBeCalled();
        const expectedAppEvent = AppEvent_1.AppEvent.fromData('user1', {
            localId: 'local1',
            type: 'type1',
            payload: {},
            metadata: {},
        });
        expect(mockAppendEvents).toBeCalledWith([expectedAppEvent]);
    }));
});
//# sourceMappingURL=AnalyticsApplicationService.test.js.map