import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { FirestoreService } from './firestore_service';

class Authenticator {
  public static readonly auth = getAuth(FirestoreService.app);

  /** Register a new User using email and password. */
  public static async register(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await createUserWithEmailAndPassword(Authenticator.auth, email, password);

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
      const credentials = await signInWithEmailAndPassword(Authenticator.auth, email, password);

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