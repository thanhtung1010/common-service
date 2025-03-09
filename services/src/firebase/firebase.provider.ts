import { Provider } from "@angular/core";
import { IFirebaseConfig } from "./firebase.interface";
import { FIREBASE_CONFIG_TOKEN } from "./firebase.enum";
import { FirebaseService } from "./firebase.service";
import { FirebaseCollectionService } from "./firebase-collection.service";

export function provideFirebaseService(firebaseConfig: IFirebaseConfig): Provider {
  return [
    { provide: FIREBASE_CONFIG_TOKEN, useValue: firebaseConfig },
    FirebaseService,
    FirebaseCollectionService,
  ];
}
