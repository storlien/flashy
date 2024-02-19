import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config: FirebaseOptions = {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
}

const app = initializeApp(config);
const db = getFirestore(app);

class Server {
    public readonly auth: Authenticator;

    constructor(app: FirebaseApp) {
        this.auth = new Authenticator(app);
    }
}

const server = new Server(app);

export default server;
