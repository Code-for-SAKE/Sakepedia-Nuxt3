import { getAnalytics, logEvent } from "firebase/analytics";

export const useAnalytics = () => {
  const app = useFirebaseApp()
  const analytics = getAnalytics(app);
  const log = (data:object) => {
    logEvent(analytics, data.toString());
  }
  return {
    analytics,
    log
  }
}
  