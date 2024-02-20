import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const config: FirebaseOptions = {
    projectId: 'flashy-f8580',
    apiKey: 'AIzaSyB7CMMNEkOJkXUwhzZbF3ih8Wb7xL0xyBM',
}

console.log(config.apiKey);

const app = initializeApp(config);
const db = getFirestore(app);

class Server {
    public readonly auth: Authenticator;

    constructor(app: FirebaseApp) {
        this.auth = new Authenticator(app);
    }

    public async createFlashcardSet(name: string, category: string, isPublic: boolean, flashcards: Flashcard[]): Promise<FlashcardSet | null> {
        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');

        const userId = this.auth.getUserId();

        const set = {
            name,
            userId,
            isPublic,
            category,
            flashcards,
        };

        try {
            const docRef = await addDoc(collection(db, 'flashcard-sets'), set);
            return docRef as unknown as FlashcardSet;
        } catch (error) {
            Server.logError(error);
            return null;
        }
    }

    /** Log an error caught in a try-catch. */
    private static logError(error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
    }
}

const server = new Server(app);

export default server;
