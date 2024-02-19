import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Authenticator } from './authenticator';

class Backend {
    private static readonly config: FirebaseOptions = {
        apiKey: process.env.API_KEY,
        projectId: process.env.PROJECT_ID
    }

    public static readonly app = initializeApp(Backend.config);
    public static readonly db = getFirestore();

    public static readonly auth: Authenticator = new Authenticator();
}

export {
    Backend,
}