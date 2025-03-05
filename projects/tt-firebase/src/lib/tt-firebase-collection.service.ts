import { Injectable } from "@angular/core";
import { TTFirebaseService } from "./tt-firebase.service";
import { BaseModel } from "./base.model";
import { from, Observable, Subscriber } from "rxjs";
import { FIREBASE_ERROR_SERVICE } from "./tt-firebase.enum";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { BaseFBCreateDocumentModel } from "./tt-firebase.model";

@Injectable({
  providedIn: 'root'
})
export class TTFirebaseCollectionService<T extends BaseModel> {
  collection!: string;
  constructor(protected firebaseService: TTFirebaseService) {}

  addNewDocument(collectionName: string, data: BaseFBCreateDocumentModel): Observable<T> {
    return new Observable<T>((subs: Subscriber<T>) => {
      try {
        const checkValid = this.firebaseService.checkValidService(this.collection);
        if (checkValid.code !== FIREBASE_ERROR_SERVICE.AUTH) {
          subs.error(checkValid);
          subs.complete();
        } else {
          const _ref = collection(this.firebaseService.store, collectionName);
          from(addDoc(_ref, data)).subscribe({
            next: resp => {
              from(getDoc(resp)).subscribe({
                next: newDoc => {
                  console.log(newDoc);
                  subs.next(newDoc as any);
                  subs.complete();
                },
                error: error => {
                  subs.error(error);
                  subs.complete();
                },
              });
            },
            error: error => {
              subs.error(error);
              subs.complete();
            }
          });
        }
      } catch (error) {
        subs.error(error);
        subs.complete();
      }
    });
  }
}
