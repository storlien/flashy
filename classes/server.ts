import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const config: FirebaseOptions = {
    apiKey: 'AIzaSyDFEhtsAA0IkzSD6PRJHFw6zfAdFee2OZc',
    projectId: 'flashy-4e8c5',
}

console.log(config.apiKey);

const app = initializeApp(config);
const db = getFirestore(app);

class Server {
    public readonly auth: Authenticator;

    constructor(app: FirebaseApp) {
        this.auth = new Authenticator(app);
    }

    public async retrieveFlashcardSets(): Promise<FlashcardSet | null> {
        const collectionRef = collection(db, 'flashcard-sets');

        try {
            const snapshot = await getDocs(collectionRef);

            if (snapshot.empty) {
                console.log('No matching documents.');
                return null;
            }

            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });

        } catch (e) {
            console.error('Error getting documents', e);
            return null;
        }

        return null;
    }
}

const server = new Server(app);

export default server;