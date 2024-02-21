import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { addDoc, collection, getFirestore, getDocs, doc, getDoc } from 'firebase/firestore';

import type { Flashcard, FlashcardSet } from '~/classes/models';

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

    public async getFlashcardSets(): Promise<FlashcardSet[]> {
        const collectionRef = collection(db, 'flashcard-sets');
        let flashcardSets: FlashcardSet[] = [];

        try {
            const snapshot = await getDocs(collectionRef);

            if (snapshot.empty) {
                console.log('No matching documents.');
                return flashcardSets;
            }

            snapshot.forEach(doc => {
                let flashcardSet = doc.data() as FlashcardSet;
                flashcardSet.id = doc.id;
                flashcardSets.push(flashcardSet);
            });

            console.log(flashcardSets);

            return flashcardSets;

        } catch (e) {
            Server.logError(e);
            return flashcardSets;
        }
    }

    public async getFlashcardSet(id: string): Promise<FlashcardSet | null> {
        try {
            const docSnap = await getDoc(doc(db, 'flashcard-sets', id));
    
            if (docSnap.exists()) {
                return docSnap.data() as FlashcardSet;
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (e) {
            Server.logError(e);
            return null;
        }
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