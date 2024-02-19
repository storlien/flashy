import type { FirebaseApp } from 'firebase/app';
import { Authenticator } from './authenticator';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config: FirebaseOptions = {
    apiKey: 'AIzaSyDFEhtsAA0IkzSD6PRJHFw6zfAdFee2OZc',
    projectId: 'flashy-4e8c5',
}

console.log(config.apiKey);

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
