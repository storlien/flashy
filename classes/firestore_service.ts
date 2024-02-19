import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
};

class FirestoreService {
    public static readonly app = initializeApp(firebaseConfig);
    public static readonly db = getFirestore();
}

export {
    FirestoreService,
}