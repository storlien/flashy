import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  projectId: process.env.PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class Authenticator {
  /** Register a new User using email and password. */
  public static async register(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);

      console.log(credentials.user);
      return credentials;
    } catch (error: any) {
      Authenticator.logError(error);

      return null;
    }
  }

  /** Login using email and password. */
  public static async login(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);

      console.log(credentials.user);
      return credentials;
    } catch (error: any) {
      Authenticator.logError(error);
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

export {
  Authenticator
}