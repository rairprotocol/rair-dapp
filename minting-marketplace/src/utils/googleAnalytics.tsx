//Google Analytics
import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
const getInformationGoogleAnalytics = () => {
  const gAppName = process.env.REACT_APP_GA_NAME;
  const gUaNumber = process.env.REACT_APP_GOOGLE_ANALYTICS;
  const analytics = Analytics({
    app: gAppName,
    plugins: [
      googleAnalytics({
        trackingId: gUaNumber
      })
    ]
  });

  return analytics;
};

export default getInformationGoogleAnalytics;
