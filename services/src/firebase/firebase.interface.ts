import { Dependencies } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface IFirestoreSearchDocument {
  field: string;
  value: any
}

export interface IInitFirebase {
  auth: boolean;
  store: boolean;
  initializeAppName?: string;
  authDependencies?: Dependencies;
}

export interface IDocumentData extends DocumentData {
  firebaseId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
