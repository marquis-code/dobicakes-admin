import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  };

  let auth = null;
  let analytics = null;

  if (firebaseConfig.apiKey) {
    try {
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      
      // Initialize analytics only if supported
      if (await isSupported()) {
        analytics = getAnalytics(app);
      }
    } catch (e) {
      console.error('Firebase initialization failed:', e);
    }
  } else {
    console.warn('Firebase API Key missing. Firebase features will be disabled.');
  }

  return {
    provide: {
      firebaseAuth: auth,
      firebaseAnalytics: analytics
    }
  };
});
