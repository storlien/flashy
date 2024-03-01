import type { FirebaseApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, type Auth, type UserCredential, type User } from 'firebase/auth';

class Authenticator {
  private readonly auth: Auth;

  public async isLoggedIn(): Promise<boolean> {
    await this.auth.authStateReady();
    return this.auth.currentUser !== null;
  }

  public getUser() {
    return this.auth.currentUser;
  }

  public getUserId(): string | undefined {
    return this.auth.currentUser?.uid;
  }

  constructor(app: FirebaseApp) {
    this.auth = getAuth(app);

    this.auth.setPersistence({ type: 'LOCAL' });

    this.auth.onAuthStateChanged(user => {
      this.handleAuthStateChange(user);
    });
  }

  /** Function is called whenever the authentication state changes */
  public async handleAuthStateChange(user: User | null) {
    if (user) {
      console.log('User is signed in: ', user.uid);
    } else {
      console.log('User is signed out');
    }
  }


  /** Register a new User using email and password. */
  public async register(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await createUserWithEmailAndPassword(this.auth, email, password);

      return credentials;
    } catch (error: any) {
      Authenticator.logError(error);

      return null;
    }
  }

  /** Login using email and password. */
  public async login(email: string, password: string): Promise<UserCredential | null> {
    try {
      const credentials = await signInWithEmailAndPassword(this.auth, email, password);

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
};
