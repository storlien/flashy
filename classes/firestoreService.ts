import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

// const dataToAdd = {
//     name: 'John Doe',
//     age: 30,
//     city: 'Example City'
// };

// async function addDocument() {
//     try {
//         const docRef = await addDoc(collection(db, "users"), dataToAdd);

//         console.log("Written ", docRef.id);
//     } catch (e) {
//         console.error("Error ", e);
//     }
// }

// function firebaseInit() {
//     addDocument();
//     console.log('Firebase-fil kjørt!');
// }

// export {
//     firebaseInit
// }