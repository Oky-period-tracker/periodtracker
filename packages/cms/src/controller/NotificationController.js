"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const typeorm_1 = require("typeorm");
const Notification_1 = require("../entity/Notification");
const PermanentNotification_1 = require("../entity/PermanentNotification");
const admin = __importStar(require("firebase-admin"));
const env_1 = require("../env");
class NotificationController {
    constructor() {
        this.notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        this.permanentNotificationRepository = (0, typeorm_1.getRepository)(PermanentNotification_1.PermanentNotification);
    }
    mobileNotificationsByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationRepository.findOne({
                where: {
                    lang: request.params.lang,
                    status: 'sent',
                },
            });
        });
    }
    mobilePermanentNotifications(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // LIKE checks if versions string contains the request param version
            const entry = yield this.permanentNotificationRepository.query(`SELECT * from ${env_1.env.db.schema}.permanent_notification WHERE versions LIKE '%%' || $1 || '%%' AND live = TRUE AND lang = $2`, [request.params.ver, request.params.lang]);
            if (entry && entry.length > 0) {
                return { message: entry[0].message, isPermanent: entry[0].isPermanent };
            }
            return { message: '', isPermanent: false };
        });
    }
    savePermanentAlert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const permanentNotificationToAdd = request.body;
            const booleanFromStringLive = request.body.live === 'true';
            const booleanFromStringIsPermanent = request.body.isPermanent === 'true';
            permanentNotificationToAdd.live = booleanFromStringLive;
            permanentNotificationToAdd.isPermanent = booleanFromStringIsPermanent;
            permanentNotificationToAdd.lang = request.user.lang;
            yield this.permanentNotificationRepository.save(permanentNotificationToAdd);
            return permanentNotificationToAdd;
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationToAdd = request.body;
            // Send to app here
            yield this.firebaseSend({
                title: request.body.title,
                body: request.body.content,
                lang: request.user.lang,
            });
            notificationToAdd.date_sent = new Date().getTime();
            notificationToAdd.status = 'sent';
            notificationToAdd.lang = request.user.lang;
            yield this.notificationRepository.save(notificationToAdd);
            return notificationToAdd;
        });
    }
    updatePermanentAlert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const permanentNotificationToUpdate = yield this.permanentNotificationRepository.findOne(request.params.id);
            const booleanFromStringLive = request.body.live === 'true';
            const booleanFromStringIsPermanent = request.body.isPermanent === 'true';
            permanentNotificationToUpdate.message = request.body.message;
            permanentNotificationToUpdate.isPermanent = booleanFromStringIsPermanent;
            permanentNotificationToUpdate.versions = request.body.versions;
            permanentNotificationToUpdate.live = booleanFromStringLive;
            permanentNotificationToUpdate.lang = request.user.lang;
            yield this.permanentNotificationRepository.save(permanentNotificationToUpdate);
            return permanentNotificationToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationToRemove = yield this.notificationRepository.findOne(request.params.id);
            yield this.notificationRepository.remove(notificationToRemove);
            return notificationToRemove;
        });
    }
    removePermanentAlert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemToRemove = yield this.permanentNotificationRepository.findOne(request.params.id);
            yield this.permanentNotificationRepository.remove(itemToRemove);
            return itemToRemove;
        });
    }
    firebaseSend(_a) {
        return __awaiter(this, arguments, void 0, function* ({ title, body, lang }) {
            const message = {
                notification: {
                    title,
                    body,
                },
                topic: `oky_${lang}_notifications`,
            };
            // Send a message to the device corresponding to the provided
            // registration token.
            admin
                .messaging()
                .send(message)
                .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
                .catch((error) => {
                console.log('Error sending message:', error);
            });
        });
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map