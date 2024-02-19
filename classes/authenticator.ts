import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { Backend } from './backend';

class Authenticator {
  private readonly auth: any;
  
  constructor {
    this.auth = getAuth(Backend.app);
  }


  /** Register a new User using email and password. */
  public async register(email: string, password: string): Promise<UserCredential | null> {
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
  public async login(email: string, password: string): Promise<UserCredential | null> {
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