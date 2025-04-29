import { Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    Query,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import {
    catchError,
    forkJoin,
    from,
    Observable,
    of,
    Subscriber,
    switchMap,
} from 'rxjs';
import {
    CreateDocumentDto,
    DeleteDocumentDto,
    UpdateDocumentDto,
} from './firebase.dto';
import { FIREBASE_ERROR_SERVICE } from './firebase.enum';
import { IDocumentData, IFirestoreSearchDocument } from './firebase.interface';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root',
})
export class FirebaseCollectionService {
    private _collection!: string;
    get collection(): string {
        return this._collection;
    }
    set collection(collection: string) {
        this._collection = collection;
    }

    constructor(protected firebaseService: FirebaseService) {}

    private isInstance(data: any): boolean {
        return (
            data !== null &&
            typeof data === 'object' &&
            Object.getPrototypeOf(data) !== Object.prototype
        );
    }

    addNewDocument(data: CreateDocumentDto): Observable<IDocumentData> {
        return new Observable((subs: Subscriber<IDocumentData>) => {
            try {
                const checkValid = this.firebaseService.checkValidService(
                    this.collection
                );
                if (
                    checkValid.code &&
                    checkValid.code !== FIREBASE_ERROR_SERVICE.AUTH
                ) {
                    subs.error(checkValid);
                    subs.complete();
                } else {
                    const _ref = collection(
                        this.firebaseService.store,
                        this.collection
                    );
                    data.createdById = this.firebaseService.user.uid;
                    const dataJson = this.isInstance(data)
                        ? CreateDocumentDto.toJson(data)
                        : data;
                    from(addDoc(_ref, dataJson))
                        .pipe(
                            catchError((error) => {
                                subs.error(error);
                                subs.complete();

                                return of(null);
                            }),
                            switchMap((resp) => {
                                return !resp ? of(null) : from(getDoc(resp));
                            })
                        )
                        .subscribe((newDoc) => {
                            if (newDoc?.exists()) {
                                const newData = {
                                    ...newDoc.data(),
                                    firebaseId: newDoc.id,
                                };
                                subs.next(newData);
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

    updateDocument(data: UpdateDocumentDto): Observable<IDocumentData> {
        return new Observable((subs: Subscriber<IDocumentData>) => {
            try {
                const checkValid = this.firebaseService.checkValidService(
                    this.collection
                );
                if (
                    checkValid.code &&
                    checkValid.code !== FIREBASE_ERROR_SERVICE.AUTH
                ) {
                    subs.error(checkValid);
                    subs.complete();
                } else {
                    const _docRef = doc(
                        this.firebaseService.store,
                        this.collection,
                        data.firebaseId
                    );
                    from(updateDoc(_docRef, { ...data }))
                        .pipe(
                            catchError((error) => {
                                subs.error(error);
                                subs.complete();
                                return of(null);
                            }),
                            switchMap((resp) => {
                                return !resp ? of(null) : from(getDoc(_docRef));
                            })
                        )
                        .subscribe((resp) => {
                            if (resp?.exists()) {
                                const newData = {
                                    ...resp.data(),
                                    firebaseId: resp.id,
                                };
                                subs.next(newData);
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

    deleteDocumentWithID(
        datas: Array<DeleteDocumentDto>
    ): Observable<Array<Boolean>> {
        return new Observable<Array<Boolean>>(
            (subs: Subscriber<Array<Boolean>>) => {
                try {
                    const checkValid = this.firebaseService.checkValidService(
                        this.collection
                    );
                    if (
                        checkValid.code &&
                        checkValid.code !== FIREBASE_ERROR_SERVICE.AUTH
                    ) {
                        subs.error(checkValid);
                        subs.complete();
                    } else {
                        const _requests: Array<Observable<void>> = [];
                        datas.forEach((item) => {
                            if (item.firebaseId) {
                                const _docRef = doc(
                                    this.firebaseService.store,
                                    this.collection,
                                    item.firebaseId
                                );
                                _requests.push(
                                    from(updateDoc(_docRef, { ...item }))
                                );
                            }
                        });

                        forkJoin(_requests).subscribe({
                            next: (resp) => {
                                subs.next(
                                    resp.map((elm) => typeof elm === 'function')
                                );
                                subs.complete();
                            },
                            error: (error) => {
                                subs.error(error);
                                subs.complete();
                            },
                        });
                    }
                } catch (error) {
                    subs.error(error);
                    subs.complete();
                }
            }
        );
    }

    searchDocuments(
        collectionName: string,
        searchFields: Array<IFirestoreSearchDocument>
    ): Observable<Array<IDocumentData>> {
        return new Observable((subs: Subscriber<Array<IDocumentData>>) => {
            try {
                const checkValid = this.firebaseService.checkValidService(
                    this.collection
                );
                if (
                    checkValid.code &&
                    checkValid.code === FIREBASE_ERROR_SERVICE.STORE
                ) {
                    subs.error(checkValid);
                    subs.complete();
                } else {
                    const _ref = collection(
                        this.firebaseService.store,
                        collectionName
                    );
                    let _query: Query = query(
                        _ref,
                        where(
                            'createdById',
                            '==',
                            this.firebaseService.user.uid
                        )
                    );
                    if (searchFields.length) {
                        searchFields.forEach((sf) => {
                            _query = query(
                                _ref,
                                where(sf.field, sf.op, sf.value)
                            );
                        });
                    }
                    _query = query(_query, orderBy('createdAt', 'desc'));
                    const _userSnap = from(getDocs(_ref));

                    _userSnap.subscribe({
                        next: (resp) => {
                            let _data: Array<IDocumentData> = [];

                            if (!resp.empty) {
                                resp.forEach((doc) => {
                                    const _docdata: IDocumentData = {
                                        ...doc.data(),
                                        firebaseId: doc.id,
                                    };
                                    _data.push(_docdata);
                                });
                            }

                            subs.next(_data);
                            subs.complete();
                        },
                        error: (error) => {
                            subs.error(error);
                            subs.complete();
                        },
                    });
                }
            } catch (error) {
                subs.error(error);
                subs.complete();
            }
        });
    }
}
