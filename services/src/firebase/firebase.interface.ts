import { Dependencies } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

//#region type
export type FIRESTORE_SEARCH_OPERATOR = '==' | '>=' | '<=' | '!=';
export type FIREBASE_AUTH_PROVIDER =
  | 'password'
  | 'google.com'
  | 'phone'
  | 'facebook.com'
  | 'github.com'
  | 'twitter.com'
  | 'microsoft.com'
  | 'apple.com';

//#region interface
export interface IFirebaseUser {
  uid: string;
  providers: Array<FIREBASE_AUTH_PROVIDER>;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  metadata: IFirebaseUserMetadata;
}

export interface IFirebaseUserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
  [key: string]: any;
}

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
  value: any;
  op: FIRESTORE_SEARCH_OPERATOR;
}

export interface IInitFirebase {
  auth: boolean;
  store: boolean;
  initializeAppName?: string;
  authDependencies?: Dependencies;
}

export interface IDocumentData extends DocumentData {
  firebaseId: string;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
