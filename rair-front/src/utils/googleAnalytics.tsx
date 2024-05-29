//Google Analytics
import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';
const getInformationGoogleAnalytics = () => {
  const gAppName = import.meta.env.VITE_GA_NAME;
  const gUaNumber = import.meta.env.VITE_GOOGLE_ANALYTICS;
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
