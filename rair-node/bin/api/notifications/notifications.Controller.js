const express = require('express');
const { requireUserSession, validation } = require('../../middleware');
const { markNotificationAsRead, getSingleNotification, listNotifications, deleteNotification } = require('./notifications.Service');

const router = express.Router();

router.get(
    '/',
    requireUserSession,
    validation(['notificationsQuery', 'dbNotifications', 'pagination'], 'query'),
    listNotifications,
);
router.get(
    '/:id',
    requireUserSession,
    validation(['dbId'], 'params'),
    getSingleNotification,
);
router.put(
    '/',
    requireUserSession,
    validation(['dbIdArray'], 'params'),
    markNotificationAsRead,
);
router.delete(
    '/',
    requireUserSession,
    validation(['dbIdArray'], 'params'),
    deleteNotification,
);

module.exports = router;
