import { Dependencies } from "firebase/auth";

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

export interface IFBCreateDocument {
  createdAt: Date;
}

export interface IFBUpdateDocument {
  updatedAt: Date;
}

export interface IFBDeleteDocument {
  deletedAt: Date;
}
