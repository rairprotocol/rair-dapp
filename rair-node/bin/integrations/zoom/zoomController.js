const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');

module.exports = {
    generateJWT: () => {
        const payload = {
            iss: process.env.ZOOM_API_KEY,
            exp: ((new Date()).getTime() + 5000),
        };
        return jwt.sign(payload, process.env.ZOOM_API_SECRET);
    },
    getMeetingInvite: async (mediaIdentifier, token, userData) => {
        const response = await axios.post(`https://api.zoom.us/v2/meetings/${mediaIdentifier}/invite_links`, {
            attendees: [{
                name: (!!userData.firstName &&
                        !!userData.lastName &&
                        `${userData.firstName} ${userData.lastName}`) ||
                            userData.nickName ||
                            userData.publicAddress,
            }],
            ttl: 1000,
        }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
    // These functions are not being used
    getMeetings: async (token) => {
        const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        console.info(response.data);
    },
    createMeeting: async (token) => {
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 1);
        const createResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
            body: {
                agenda: 'RAIR Meeting',
                default_password: false,
                duration: 60, // In minutes
                password: Math.round(Math.random() * 100000).toString(),
                pre_schedule: false,
                schedule_for: 'jmsm412@gmail.com',
                settings: {
                    allow_multiple_devices: true,
                    approval_type: 2,
                    auto_recording: 'cloud',
                    calendar_type: 1,
                    close_registration: false,
                    encryption_type: 'enhanced_encryption',
                    focus_mode: true,
                    host_video: true,
                    jbh_time: 0,
                    join_before_host: false,
                    mute_upon_entry: false,
                    participant_video: false,
                    private_meeting: false,
                    registrants_confirmation_email: true,
                    registrants_email_notification: true,
                    registration_type: 1,
                    show_share_button: true,
                    use_pmi: false,
                    waiting_room: false,
                    watermark: false,
                    host_save_video_order: true,
                    alternative_host_update_polls: true,
                },
                start_time: dateTime.toISOString(),
                template_id: 'Dv4YdINdTk+Z5RToadh5ug==',
                timezone: 'America/Los_Angeles',
                topic: 'Test Meeting',
                type: 2,
            },
        }, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        console.log(createResponse.data);
    },
};
