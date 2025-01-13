const axios = require('axios');
const qs = require('query-string');

const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2'

exports.getMeeting = async (req, res, next) => {
  const { headerConfig, params } = req;
  const { meetingId } = params;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, headerConfig);
    return res.json({
      success: true,
      ...request.data
    });
  } catch (err) {
    return next(err)
  }
}

exports.createMeeting = async (req, res, next) => {
  const { headerConfig, params, body } = req;
  const { userId } = params;

  try {
    const request = await axios.post(`${ZOOM_API_BASE_URL}/users/${userId}/meetings`, body, headerConfig);
    return res.json({
      success: true,
      ...request.data
    });
  } catch (err) {
    return next(err)
  }
}

exports.updateMeeting = async (req, res, next) => {
  const { headerConfig, params, body } = req;
  const { meetingId } = params;

  try {
    const request = await axios.patch(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, body, headerConfig);
    return res.json({
      success: true,
      ...request.data
    });
  } catch (err) {
    return next(err)
  }
}

exports.deleteMeeting = async (req, res, next) => {
  const { headerConfig, params } = req;
  const { meetingId } = params;

  try {
    const request = await axios.delete(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, headerConfig);
    return res.json({
      success: true,
      ...request.data
    });
  } catch (err) {
    return next(err)
  }
}

exports.getMeetingParticipantReport = async (req, res, next) => {
  const { headerConfig, params, query } = req;
  const { meetingId } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(`${ZOOM_API_BASE_URL}/report/meetings/${meetingId}/participants?${qs.stringify({
      next_page_token,
    })}`, headerConfig);
    return res.json({
      success: true,
      ...request.data
    });
  } catch (err) {
    return next(err)
  }
}

exports.deleteMeetingRecordings = async (req, res, next) => {
  const { headerConfig, params, query } = req;
  const { meetingId } = params;
  const { action } = query;

  try {
    const request = await axios.delete(`${ZOOM_API_BASE_URL}/meetings/${meetingId}/recordings?${qs.stringify({ action })}`, headerConfig);
    return res.json({
      success: true,
      ...request.data
    });
  } catch (err) {
    return next(err)
  }
}
