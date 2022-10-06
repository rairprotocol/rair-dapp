//Google Analytics
import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';
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
