import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, browserLocalPersistence, browserPopupRedirectResolver, Dependencies, getAuth, GoogleAuthProvider, initializeAuth, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, doc, Firestore, getDoc, getFirestore, where, query, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN, FIREBASE_ERROR_SERVICE, FIRESTORE_DEFAULT_COLLECTION } from './firebase.enum';
import { IFirebaseConfig, IFirestoreSearchDocument, IInitFirebase } from './firebase.interface';
import { forkJoin, from, Observable, Subscriber } from 'rxjs';
import { AuthDependenciesModel, FirebaseUserModel, InitFirebaseModel } from './firebase.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _firebaseApp!: FirebaseApp;
  private _auth!: Auth;
  private _store!: Firestore;
  private _user!: FirebaseUserModel;

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

  get user(): FirebaseUserModel {
    return this._user;
  }

  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) private config: IFirebaseConfig,
  ) {}

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
          dependencies = AuthDependenciesModel.fromJson(dependencies ?? {});
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
  authStateChanged(): Observable<FirebaseUserModel | null> {
    return new Observable((subs: Subscriber<FirebaseUserModel | null>) => {
      try {
        const checkValid = this.checkValidService('');
        if (
          checkValid.code
          && checkValid.code !== FIREBASE_ERROR_SERVICE.COLLECTION
          && checkValid.code !== FIREBASE_ERROR_SERVICE.STORE
        ) {
          subs.error(checkValid);
          subs.complete();
        } else {
          onAuthStateChanged(this._auth,
            (user) => {
              if (user) {
                this._user = FirebaseUserModel.fromJson(user);
                subs.next(this._user);
              } else {
                subs.next(null);
              }
              subs.complete();
            },
            error => {
              subs.error(error);
              subs.complete();
            }
          );
        }
      } catch (error) {
        this.logout();
        subs.error(error);
        subs.complete();
      }
    });
  }

  googleLogin(): Observable<FirebaseUserModel> {
    return new Observable((subs: Subscriber<FirebaseUserModel>) => {
      try {
        const checkValid = this.checkValidService('');
        if (
          checkValid.code
          && checkValid.code !== FIREBASE_ERROR_SERVICE.COLLECTION
          && checkValid.code !== FIREBASE_ERROR_SERVICE.STORE
        ) {
          subs.error(checkValid);
          subs.complete();
        } else {
          from(signInWithPopup(this._auth, new GoogleAuthProvider())).subscribe({
            next: resp => {
              this._user = FirebaseUserModel.fromJson(resp.user);
              subs.next(this._user);
              subs.complete();
            },
            error: error => {
              this.logout();
              subs.error(error);
              subs.complete();
            }
          });
        }
      } catch (error) {
        this.logout();
        subs.error(error);
        subs.complete();
      }
    });
  }

  logout(): Observable<boolean> {
    return new Observable((subs: Subscriber<boolean>) => {
      try {
        if (!this._user) {
          subs.error('You have no login!!!');
          subs.complete();
        } else {
          from(signOut(this._auth)).subscribe({
            next: resp => {
              subs.next(true);
              subs.complete();
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
