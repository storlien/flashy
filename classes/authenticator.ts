import type { FirebaseApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, type Auth, type UserCredential } from 'firebase/auth';

class Authenticator {
  private readonly auth: Auth;
  private credentials: UserCredential | undefined;
  
  constructor(app: FirebaseApp) {
    this.auth = getAuth(app);
  }


  /** Register a new User using email and password. */
  public async register(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await createUserWithEmailAndPassword(this.auth, email, password);

      console.log(credentials.user);
      return this.credentials = credentials;
    } catch (error: any) {
      Authenticator.logError(error);

      return null;
    }
  }

  /** Login using email and password. */
  public async login(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await signInWithEmailAndPassword(this.auth, email, password);

      console.log(credentials.user);
      return this.credentials = credentials;
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
};
