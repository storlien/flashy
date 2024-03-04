import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { addDoc, collection, getFirestore, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import type { Flashcard, FlashcardSet, FlashcardSetPrefs, UserSettings } from '~/classes/models';

const config: FirebaseOptions = {
    projectId: 'flashy-f8580',
    apiKey: 'AIzaSyB7CMMNEkOJkXUwhzZbF3ih8Wb7xL0xyBM',
}

console.log(config.apiKey);

const app = initializeApp(config);
const db = getFirestore(app);

class Server {
    public readonly auth: Authenticator;
    public readonly userSettingsCache = reactive<UserSettings>({name: '', email: '', favoriteSets: []});

    constructor(app: FirebaseApp) {
        this.auth = new Authenticator(app);
    }

    // TODO: Can refactor this to return public flashcard sets, but filter out sets that are not yours
    public async getUserFlashcardSets(): Promise<FlashcardSet[]> {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'flashcard-sets');
        let flashcardSets: FlashcardSet[] = [];

        try {
            const snapshot = await getDocs(collectionRef);

            if (snapshot.empty) {
                console.log('No matching documents.');
                return flashcardSets;
            }

            snapshot.forEach(doc => {
                const flashcardSet = doc.data() as FlashcardSet;
                flashcardSet.id = doc.id;

                if (flashcardSet.userId === userId) {
                    flashcardSets.push(flashcardSet);
                }
            });

            console.log(flashcardSets);

            return flashcardSets;

        } catch (e) {
            Server.logError(e);
            return flashcardSets;
        }
    }

    /** Get public sets including your own (possibly private) sets. */
    public async getPublicFlashcardSets(): Promise<FlashcardSet[]> {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'flashcard-sets');
        let flashcardSets: FlashcardSet[] = [];

        try {
            const snapshot = await getDocs(collectionRef);

            if (snapshot.empty) {
                console.log('No matching documents.');
                return flashcardSets;
            }

            snapshot.forEach(doc => {
                const flashcardSet = doc.data() as FlashcardSet;
                flashcardSet.id = doc.id;

                if (flashcardSet.isPublic || flashcardSet.userId === userId) {
                    flashcardSets.push(flashcardSet);
                }
            });

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
                const data = docSnap.data() as FlashcardSet;
                return {
                    id,
                    userId: data.userId,
                    name: data.name,
                    category: data.category,
                    isPublic: data.isPublic,
                    flashcards: data.flashcards,
                }
            } else {
                console.log(`No document with id ${id}`);
                return null;
            }
        } catch (e) {
            Server.logError(e);
            return null;
        }
    }

    public async deleteFlashcardSet(set: FlashcardSet): Promise<boolean> {
        const userId = this.auth.getUserId();

        if (!userId || userId !== set.userId) throw new Error('Unauthorized');

        try {
            await deleteDoc(doc(db, 'flashcard-sets', set.id));

            return true;
        } catch (e) {
            Server.logError(e);

            return false;
        }
    }

    /** Get user preferences for a set, if any. */
    public async getUserSetPrefs(userId: string, setId: string): Promise<FlashcardSetPrefs | null> {
        const collectionRef = collection(db, 'user-set-prefs');

        const docRef = await getDoc(doc(collectionRef, `${userId}:${setId}`));

        if (docRef.exists()) {
            return docRef.data() as FlashcardSetPrefs;
        } else {
            return null;
        }
    }

    /** Update user preferences for a set. */
    public async updateUserSetPrefs(prefs: FlashcardSetPrefs): Promise<void> {
        const collectionRef = collection(db, 'user-set-prefs');

        await setDoc(doc(collectionRef, `${prefs.userId}:${prefs.setId}`), prefs);
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

    public async updateFlashcardSet(set: FlashcardSet) {
        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'flashcard-sets');
        const docRef = doc(collectionRef, set.id);
        const docSnap = await getDoc(docRef);

        const update = {
            name: set.name,
            userId: set.userId,
            isPublic: set.isPublic,
            category: set.category,
            flashcards: set.flashcards,
        };

        if (docSnap.exists()) {
            await updateDoc(docRef, update);
        }
    }

    /** Update favorite flashcard sets */
    public async updateFavoriteSets(favoriteSets: String[]) {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { favoriteSets });
            console.log('Successfully updated favorite sets');
        }
    }

    /** Get favorite flashcard sets */
    public async getUserSettings(): Promise<UserSettings | null> {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const settings = docSnap.data() as UserSettings;
            
            this.userSettingsCache.name = settings.name;
            this.userSettingsCache.email = settings.email;
            this.userSettingsCache.favoriteSets = settings.favoriteSets;

            return settings;
        } 

        return null;
    }

    /** Creates empty user settings document */
    public async createUserSettings(): Promise<UserSettings | null> {
        const userId = this.auth.getUserId();
        const user = this.auth.getUser();
        // const credentials = this.auth.getCredentials();

        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return null;
        } else {
            const settings: UserSettings =  {
                name: null,
                email: user!.email,
                favoriteSets: [],
            };
            await setDoc(docRef, settings);

            this.userSettingsCache.name = settings.name;
            this.userSettingsCache.email = settings.email;
            this.userSettingsCache.favoriteSets = settings.favoriteSets;

            return settings;
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