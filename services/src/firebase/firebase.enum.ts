import { InjectionToken } from "@angular/core";
import { IFirebaseConfig } from "./firebase.interface";

export const FIREBASE_CONFIG_TOKEN = new InjectionToken<IFirebaseConfig>('firebaseConfig');
export const FIRESTORE_DEFAULT_COLLECTION = {
  USERS: 'USERS',
};

export enum FIREBASE_ERROR_SERVICE {
  INIT = "INIT",
  AUTH = "AUTH",
  STORE = "STORE",
  COLLECTION = "COLLECTION",
};
