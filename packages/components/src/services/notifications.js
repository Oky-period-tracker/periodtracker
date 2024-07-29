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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestUserPermission = exports.notificationListener = exports.setScheduledNotification = exports.cancelAllScheduledNotifications = exports.createNotificationChannel = void 0;
const messaging_1 = __importDefault(require("@react-native-firebase/messaging"));
const react_native_push_notification_1 = __importDefault(require("react-native-push-notification"));
const push_notification_ios_1 = __importDefault(require("@react-native-community/push-notification-ios"));
const createNotificationChannel = () => {
    const channel = react_native_push_notification_1.default.createChannel({
        channelId: 'Scheduled', // channelId
        channelName: 'Scheduled Notifications Channel', // channel name
        channelDescription: 'Used for getting reminder notification', // channel description
        importance: 4,
    }, (created) => {
        // console.log('created', created);
    });
    return channel;
};
exports.createNotificationChannel = createNotificationChannel;
const cancelAllScheduledNotifications = () => {
    return react_native_push_notification_1.default.cancelAllLocalNotifications();
};
exports.cancelAllScheduledNotifications = cancelAllScheduledNotifications;
const setScheduledNotification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ time, title, body }) {
    return react_native_push_notification_1.default.scheduleLocalNotification({
        title,
        message: body,
        date: time.valueOf,
        soundName: 'default',
        priority: 'high',
        channelId: 'Scheduled',
        autoCancel: true,
        ignoreInForeground: false,
    });
    // return firebase.notifications().scheduleNotification(buildNotification({ title, body }), {
    //   fireDate: time.valueOf(),
    //   // @ts-ignore
    //   exact: true, // this was for a exact timing issue with notifications may become deprecated as it doesn't exist on the type
    // })
});
exports.setScheduledNotification = setScheduledNotification;
const notificationListener = () => {
    react_native_push_notification_1.default.configure({
        // (required) Called when a remote or local notification is opened or received
        // (required) Called when a remote or local notification is opened or received
        onNotification(notification) {
            // process the notification here
            const { message, subText } = notification;
            // required on iOS only
            notification.finish(push_notification_ios_1.default.FetchResult.NoData);
        },
        // iOS only
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
    react_native_push_notification_1.default.configure({
        onNotification(notification) {
            const { foreground, userInteraction, subText, message } = notification;
            if (foreground && (subText || message) && !userInteraction)
                react_native_push_notification_1.default.localNotification({
                    // title: subText,
                    message: subText,
                    // date: time.valueOf,
                    soundName: 'default',
                    priority: 'high',
                    channelId: 'Scheduled',
                    autoCancel: true,
                    ignoreInForeground: false,
                });
            notification.finish(push_notification_ios_1.default.FetchResult.NoData);
        },
        // iOS only
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
};
exports.notificationListener = notificationListener;
const requestUserPermission = () => __awaiter(void 0, void 0, void 0, function* () {
    const authStatus = yield (0, messaging_1.default)().requestPermission();
    const enabled = authStatus === messaging_1.default.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging_1.default.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        // console.log('Notification Authorization status Error:', authStatus)
    }
});
exports.requestUserPermission = requestUserPermission;
//# sourceMappingURL=notifications.js.map