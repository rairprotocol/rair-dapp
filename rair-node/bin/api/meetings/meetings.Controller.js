const express = require('express');
const { zoomTokenCheck } = require('../../middleware');
const {
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetingParticipantReport,
  deleteMeetingRecordings,
} = require('./meetings.Service');

const router = express.Router();

router.use(zoomTokenCheck);

/**
 * Get a meeting
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meeting
 */
router.get(
  '/:meetingId',
  getMeeting,
);

/**
 * Create a meeting
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingCreate
 */
router.post(
  '/:userId',
  createMeeting,
);

/**
 * Update a meeting
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingUpdate
 */
router.patch(
  '/:meetingId',
  updateMeeting,
);

/**
 * Delete a meeting
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingDelete
 */
router.delete(
  '/:meetingId',
  deleteMeeting,
);

/**
 * Get meeting participant reports
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/reportMeetingParticipants
 */
router.get(
  '/:meetingId/report/participants',
  getMeetingParticipantReport,
);

/**
 * Delete meeting recordings
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/recordingDelete
 */
router.delete(
  '/:meetingId/recordings',
  deleteMeetingRecordings,
);

module.exports = router;
