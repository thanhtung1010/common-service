import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, browserLocalPersistence, browserPopupRedirectResolver, Dependencies, getAuth, initializeAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, doc, Firestore, getDoc, getFirestore, where, query, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN, FIREBASE_ERROR_SERVICE, FIRESTORE_DEFAULT_COLLECTION } from './firebase.enum';
import { IFirebaseConfig, IFirestoreSearchDocument, IInitFirebase } from './firebase.interface';
import { forkJoin, from, Observable, Subscriber } from 'rxjs';
import { AuthDependenciesModel, InitFirebaseModel } from './firebase.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _firebaseApp!: FirebaseApp;
  private _auth!: Auth;
  private _store!: Firestore;

  //#region get-set
  get firebaseApp(): FirebaseApp {
    return this._firebaseApp;
  }

  get auth(): Auth {
    return this._auth;
  }

  get store(): Firestore {
    return this._store;
  }

  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) private config: IFirebaseConfig,
  ) { }

  //#region init
  init(option?: IInitFirebase): Observable<FirebaseApp> {
    return new Observable((subs: Subscriber<FirebaseApp>) => {
      try {
        const _option = InitFirebaseModel.fromJson(option ?? {});
        if (!this.config) {
          subs.error('firebase config is invalid');
          subs.complete();
        } else {
          if (!this._firebaseApp) {
            this._firebaseApp = initializeApp(this.config, option?.initializeAppName);
          } else {
            console.warn('firebase app already init, system skip this step');
          }

          const initReqs: Array<Observable<Auth | Firestore>> = [];
          if (_option.auth) {
            initReqs.push(this.initAuth(option?.authDependencies));
          }
          if (_option.store) {
            initReqs.push(this.initFireStore());
          }

          forkJoin(initReqs).subscribe({
            next: resp => {
              subs.next(this._firebaseApp);
              subs.complete();
            },
            error: error => {
              subs.error(JSON.stringify(error));
              subs.complete();
            }
          });
        }
      } catch (error) {
        subs.error(JSON.stringify(error));
        subs.complete();
      }
    });
  }

  initAuth(dependencies?: Dependencies): Observable<Auth> {
    return new Observable((subs: Subscriber<Auth>) => {
      try {
        if (!this._firebaseApp) {
          throw new Error('Pls init firebase app before use this method');
        }

        if (document !== undefined) {
          this._auth = initializeAuth(this._firebaseApp, dependencies);
        } else {
          this._auth = getAuth(this._firebaseApp);
        }

        subs.next(this._auth);
        subs.complete();
      } catch (error) {
        subs.error(error);
        subs.complete();
      }
    });
  }

  initFireStore(): Observable<Firestore> {
    return new Observable((subs: Subscriber<Firestore>) => {
      try {
        if (!this._firebaseApp) {
          throw new Error('Pls init firebase app before use this method');
        }
        this._store = getFirestore(this._firebaseApp);
        subs.next(this._store);
        subs.complete();
      } catch (error) {
        subs.error(error);
        subs.complete();
      }
    });
  }

  checkValidService(collection: string): {
    error: boolean,
    message: string,
    code?: FIREBASE_ERROR_SERVICE,
  } {
    if (!this._firebaseApp) {
      return {
        error: true,
        code: FIREBASE_ERROR_SERVICE.INIT,
        message: 'Firebase app have not init or firebase config is invalid, pls check your firebase console.',
      };
    }

    if (!this._auth) {
      return {
        error: true,
        code: FIREBASE_ERROR_SERVICE.AUTH,
        message: 'Firebase auth have not init, pls run func init auth before use it.',
      };
    }

    if (!this._store) {
      return {
        error: true,
        code: FIREBASE_ERROR_SERVICE.STORE,
        message: 'Firebase store have not init, pls run func init store before use it',
      };
    }

    if (!collection) {
      return {
        error: true,
        code: FIREBASE_ERROR_SERVICE.COLLECTION,
        message: 'You not defined collection name yet.',
      };
    }

    return {
      error: false,
      message: 'Config valid',
    };
  }

  //#region method
  checkExistStore<T>(field: string, value: any): Observable<{empty: boolean; data: T | null}> {
    return new Observable<{empty: boolean; data: T | null}>((subs: Subscriber<{empty: boolean; data: T | null}>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _ref = collection(this._store as any, FIRESTORE_DEFAULT_COLLECTION.USERS);
        const _query = query(_ref, where(field, "==", value));
        const _userSnap = from(getDocs(_query));

        _userSnap.subscribe({
          next: resp => {
            let _data: any = null;

            if (!resp.empty) {
              resp.forEach((doc) => {
                  if (!_data) {
                    _data = doc.data();
                }
              });
            }

            subs.next({
              empty: resp.empty,
              data: _data
            });
            subs.complete();
          },
          error: error => {
            subs.error(error);
            subs.complete();
          },
        });
      } catch (error) {
        subs.error(error);
        subs.complete();
      }
    });
  }

  getCollection<T>(collectionName: string, userID: string): Observable<Array<T>> {
    return new Observable<Array<T>>((subs: Subscriber<Array<T>>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _ref = collection(this._store as any, collectionName);
        const _query = query(_ref, where('userID', '==', userID));
        const _userSnap = from(getDocs(_query));

        _userSnap.subscribe({
          next: resp => {
            const _data: Array<T> = [];

            if (!resp.empty) {
              resp.forEach((doc) => {
                const _docdata: T = {
                  ...doc.data() as T,
                  firebaseID: doc.id
                };
                _data.push(_docdata);
              });
            }

            subs.next(_data);
            subs.complete();
          },
          error: error => {
            subs.error(error);
            subs.complete();
          },
        });
      } catch (error) {
        subs.error(error);
        subs.complete();
      }
    });
  }

  addNewDocument(collectionName: string, data: any): Observable<boolean> {
    return new Observable<boolean>((subs: Subscriber<boolean>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _ref = collection(this._store as any, collectionName);
        from(addDoc(_ref, data)).subscribe({
          next: resp => {
            subs.next(true);
          },
          error: error => {
            console.error(error);
            subs.next(false);
          }
        });
      } catch (error) {
        console.error(error);
        subs.next(false);
      }
    });
  }

  updateDocument(collectionName: string, firebaseID: string, data: any): Observable<boolean> {
    return new Observable<boolean>((subs: Subscriber<boolean>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _ref = doc(this._store as any, collectionName, firebaseID);
        from(updateDoc(_ref, data)).subscribe({
          next: resp => {
            subs.next(true);
          },
          error: error => {
            console.error(error);
            subs.next(false);
          }
        });
      } catch (error) {
        console.error(error);
        subs.next(false);
      }
    });
  }

  searchDocument<T>(collectionName: string, userID: string, searchField: IFirestoreSearchDocument): Observable<Array<T>> {
    return searchField.value ? this.searchDocumentWithField<T>(collectionName, userID, searchField) : this.getCollection<T>(collectionName, userID);
  }

  searchDocumentWithField<T>(collectionName: string, userID: string, searchField: IFirestoreSearchDocument): Observable<Array<T>> {
    return new Observable<Array<T>>((subs: Subscriber<Array<T>>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _ref = collection(this._store as any, collectionName);
        const _query = query(_ref, where('userID', '==', userID));
        const _userSnap = from(getDocs(_ref));

        _userSnap.subscribe({
          next: resp => {
            let _data: Array<T> = [];

            if (!resp.empty) {
              resp.forEach((doc) => {
                const _docdata: T = {
                  ...doc.data() as T,
                  firebaseID: doc.id
                };
                _data.push(_docdata);
              });
            }
            _data = _data.filter((elm: any) => {
              let returnValue: boolean = false;
              const valueType = typeof elm[searchField.field];
              switch (valueType) {
                case 'string':
                  returnValue = elm[searchField.field].includes(searchField.value);
                  break;

                default:
                  returnValue = elm[searchField.field] === searchField.value;
                  break;
              }

              return returnValue;
            });

            subs.next(_data);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next([]);
            subs.complete();
          },
        });
      } catch (error) {
        console.error(error);
        subs.next([]);
        subs.complete();
      }
    });
  }

  searchDocumentWithID<T>(collectionName: string, userID: string, firebaseID: string): Observable<T | null> {
    return new Observable<T | null>((subs: Subscriber<T | null>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _docref = doc(this._store as any, collectionName, firebaseID);
        const _userSnap = from(getDoc(_docref));

        _userSnap.subscribe({
          next: resp => {
            let _data: T | null = null;

            if (resp.exists()) {
              const _docdata: any = resp.data();

              if (_docdata['userID'] && _docdata['userID'] === userID) {
                _data = _docdata;
              }
            }

            subs.next(_data);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next(null);
            subs.complete();
          },
        });
      } catch (error) {
        console.error(error);
        subs.next(null);
        subs.complete();
      }
    });
  }

  deleteDocumentWithID<T>(collectionName: string, firebaseID: string): Observable<boolean> {
    return new Observable<boolean>((subs: Subscriber<boolean>) => {
      try {
        if (!this._store) {
          this.initFireStore();
        }

        const _docref = doc(this._store as any, collectionName, firebaseID);
        const _userSnap = from(deleteDoc(_docref));

        _userSnap.subscribe({
          next: resp => {
            subs.next(true);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next(false);
            subs.complete();
          },
        });
      } catch (error) {
        console.error(error);
        subs.next(false);
        subs.complete();
      }
    });
  }

  logout(): Observable<boolean> {
    return new Observable((subs: Subscriber<boolean>) => {
      try {
        if (!this._auth) {
          subs.next(true);
          subs.complete();
        } else {
          from(signOut(this._auth)).subscribe({
            next: resp => {
              subs.next(true);
              subs.complete();
            },
            error: error => {
              console.error("Error signing out user:", error);
              subs.next(false);
              subs.complete();
            }
          });
        }
      } catch (error) {
        console.error("Error signing out user:", error);
        subs.next(false);
        subs.complete();
      }
    });
  }
}
