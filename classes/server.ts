import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { uploadBytesResumable } from 'firebase/storage';

import { updateEmail, updatePassword } from 'firebase/auth';
import type { Flashcard, FlashcardImage, FlashcardSet, FlashcardSetPrefs, ImageMetadata, UserSettings } from '~/classes/models';
import type { User } from 'firebase/auth';

const config: FirebaseOptions = {
    projectId: 'flashy-f8580',
    apiKey: 'AIzaSyB7CMMNEkOJkXUwhzZbF3ih8Wb7xL0xyBM',
    storageBucket: 'gs://flashy-f8580.appspot.com',
}

const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);

class Server {
    public readonly auth: Authenticator;
    public readonly userSettingsCache = reactive<UserSettings>({ name: '', email: '', favoriteSets: [] });

    constructor(app: FirebaseApp) {
        this.auth = new Authenticator(app);
    }

    //TODO: Can refactor this to return public flashcard sets, but filter out sets that are not yours
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

    public async createFlashcardSet(name: string, category: string, isPublic: boolean, flashcards: Flashcard[], id: string): Promise<FlashcardSet | null> {
        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');

        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const docRef = doc(collection(db, 'flashcard-sets'), id);

        const set: FlashcardSet = {
            id,
            name,
            userId,
            isPublic,
            category,
            flashcards,
        };

        try {
            await setDoc(docRef, set);
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

    public async getAdmins(): Promise<UserSettings[]> {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        let admins: UserSettings[] = [];

        try {
            const snapshot = await getDocs(collectionRef);

            if (snapshot.empty) {
                console.log('No matching documents.');
                return admins;
            }

            snapshot.forEach(doc => {
                const user = doc.data() as UserSettings;
                user.id = doc.id;

                if (user.role === "admin") {
                    admins.push(user);
                }
            });

            return admins;

        } catch (e) {
            Server.logError(e);
            return admins;
        }
    }

    public async updateRole(userId: string, role: string | null ): Promise<boolean> {
        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, userId);
        const docSnap = await getDoc(docRef);

        const update = {
            role
        };

        if (docSnap.exists()) {
            await updateDoc(docRef, update);
            return true;
        }

        return false;
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

    /** Update user settings */
    public async updateUserSettings(settings: UserSettings) {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, settings);
            console.log('Successfully updated user settings');
        }
    }

    /**Update email */
    public async updateUserEmail(email: string) {
        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');
        if (!email) throw new Error('Invalid email');
        if (this.auth.getUser() === null) throw new Error('Invalid user');
        updateEmail(this.auth.getUser()!, email);
    }

    /** Update user name */
    public async updateUsername(name: string) {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        const collectionRef = collection(db, 'users');
        const docRef = doc(collectionRef, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, { name });
            console.log('Successfully updated user name');
        }
    }

    /** Update user password */
    public async updateUserPassword(password: string) {
        if (!this.auth.isLoggedIn()) throw new Error('Unauthorized');
        if (!password) throw new Error('Invalid password');
        if (this.auth.getUser() === null) throw new Error('Invalid user');
        updatePassword(this.auth.getUser()!, password);
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
            const settings: UserSettings = {
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

    public getNewFlashcardSetId(): string {
        const collectionRef = collection(db, 'flashcard-sets');
        return doc(collectionRef).id;
    }

    /** Upload image, return imageId */
    public async uploadImage(file: File, flashcardSetId: string, flashcardId: string, isQuestionImage: boolean): Promise<String | null> {
        const userId = this.auth.getUserId();

        if (!userId) throw new Error('Unauthorized');

        let imageId = flashcardId;

        if (isQuestionImage) {
            imageId += "_question";
        } else {
            imageId += "_answer";
        }

        const storageRef = ref(storage, `images/${flashcardSetId}/${imageId}`);

        const metadata: ImageMetadata = {
            customMetadata: {
                userId,
                flashcardSetId,
            }
        }

        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');

                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    case 'success':
                        console.log('Upload is complete');
                        break;
                }

            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log('User does not have permission to access the object');
                        break;
                    case 'storage/canceled':
                        console.log('User canceled the upload');
                        break;
                    case 'storage/unknown':
                        console.log('Unknown error occurred, inspect error.serverResponse');
                        break;
                }
            },
            () => {
                console.log('Upload complete');
                return imageId;
            }
        );

        return null;

    }

    /** Log an error caught in a try-catch. */
    private static logError(error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorCode, errorMessage);
    }

    public async getImagesForFlashcardSet(set: FlashcardSet): Promise<FlashcardImage[]> {
        const urls: FlashcardImage[] = [];

        const storage = getStorage(app);

        set.flashcards.forEach(async (flashcard) => {
            // Add question image
            if (flashcard.hasQuestionImage) {
                const path = `images/${set.id}/${flashcard.id}_question`;
                const imageRef = ref(storage, path);

                const url = await getDownloadURL(imageRef);

                urls.push({
                    cardId: flashcard.id,
                    type: 'question',
                    url,
                });
            }

            // Add answer image
            if (flashcard.hasAnswerImage) {
                const path = `images/${set.id}/${flashcard.id}_answer`;
                const imageRef = ref(storage, path);

                const url = await getDownloadURL(imageRef);

                urls.push({
                    cardId: flashcard.id,
                    type: 'answer',
                    url,
                });
            }
        });

        return urls;
    }
}

const server = new Server(app);

export default server;