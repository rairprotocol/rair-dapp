const express = require('express');
const { requireUserSession, validation } = require('../../middleware');
const { markNotificationAsRead, getSingleNotification, listNotifications, deleteNotification } = require('./notifications.Service');

const router = express.Router();

router.get(
    '/',
    requireUserSession,
    validation(['dbNotifications', 'pagination'], 'query'),
    listNotifications,
);
router.get(
    '/:id',
    requireUserSession,
    validation(['dbId'], 'params'),
    getSingleNotification,
);
router.put(
    '/:id/',
    requireUserSession,
    validation(['dbId'], 'params'),
    markNotificationAsRead,
);
router.delete(
    '/:id',
    requireUserSession,
    validation(['dbId'], 'params'),
    deleteNotification,
);

module.exports = router;
