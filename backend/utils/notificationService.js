const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

const expo = new Expo();

/**
 * Send push notifications to users based on their role.
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string|null} role - Target role (e.g., 'customer', 'admin') or null for all
 * @param {object} data - Optional extra data payload
 */
const sendPushNotifications = async (title, body, role = null, data = {}) => {
    try {
        const query = { pushToken: { $exists: true, $ne: null, $ne: '' } };
        if (role) query.role = role;

        const users = await User.find(query).select('pushToken');

        if (users.length === 0) {
            console.log(`No users with role ${role || 'any'} and push tokens found.`);
            return;
        }

        const messages = [];
        for (const user of users) {
            if (!Expo.isExpoPushToken(user.pushToken)) {
                console.warn(`Invalid push token for user: ${user.pushToken}`);
                continue;
            }

            messages.push({
                to: user.pushToken,
                sound: 'default',
                title,
                body,
                data,
            });
        }

        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending push notification chunk:', error);
            }
        }

        console.log(`Push notifications sent: ${tickets.length} tickets to ${role || 'all users'}`);
        return tickets;
    } catch (error) {
        console.error('Error in sendPushNotifications:', error);
    }
};

const sendPushNotificationToAll = (title, body, data = {}) => sendPushNotifications(title, body, null, data);
const sendPushNotificationToCustomers = (title, body, data = {}) => sendPushNotifications(title, body, 'customer', data);
const sendPushNotificationToAdmins = (title, body, data = {}) => sendPushNotifications(title, body, 'admin', data);

module.exports = { 
    sendPushNotificationToAll, 
    sendPushNotificationToCustomers, 
    sendPushNotificationToAdmins 
};
