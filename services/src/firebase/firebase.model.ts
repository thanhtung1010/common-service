import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseModel, Default } from '../base/model';
import { FIREBASE_AUTH_PROVIDER, IFirebaseUser, IFirebaseUserMetadata, IInitFirebase } from './firebase.interface';
import {
  AuthErrorMap,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  Dependencies,
  Persistence,
  PopupRedirectResolver,
  User,
} from 'firebase/auth';

@Exclude()
export class FirebaseUserModel extends BaseModel implements IFirebaseUser {
  @Expose()
  uid!: string;

  @Expose()
  @Transform(params => {
    const obj: User = params.obj;
    return obj.providerData?.map(pr => pr.providerId);
  })
  providers!: Array<FIREBASE_AUTH_PROVIDER>;

  @Expose()
  email?: string;

  @Expose()
  phoneNumber?: string;

  @Expose()
  displayName?: string;

  @Expose()
  photoURL?: string;

  @Expose()
  @Type(() => FirebaseUserMetadataModel)
  metadata!: FirebaseUserMetadataModel;
}

@Expose()
export class FirebaseUserMetadataModel extends BaseModel implements IFirebaseUserMetadata {
  @Expose()
  creationTime?: string;

  @Expose()
  lastSignInTime?: string;
}

@Exclude()
export class InitFirebaseModel extends BaseModel implements IInitFirebase {
  @Expose()
  @Default(true)
  auth!: boolean;

  @Expose()
  @Default(true)
  store!: boolean;

  @Expose()
  initializeAppName?: string;

  @Expose()
  @Type(() => AuthDependenciesModel)
  authDependencies?: AuthDependenciesModel;
}

@Exclude()
export class AuthDependenciesModel extends BaseModel implements Dependencies {
  @Expose()
  @Default(browserLocalPersistence)
  persistence?: Persistence | Persistence[];

  @Expose()
  @Default(browserPopupRedirectResolver)
  popupRedirectResolver?: PopupRedirectResolver;

  @Expose()
  errorMap?: AuthErrorMap;
}

@Expose()
export class CreateDocumentModel extends BaseModel {
  @Expose()
  createdById?: string;

  @Expose()
  @Type(() => Date)
  @Transform(params => {
    const { value } = params;
    if (!value) return new Date().toISOString();

    return value;
  })
  createdAt!: string;
}

@Expose()
export class UpdateDocumentModel extends BaseModel {
  @Expose()
  firebaseId!: string;

  @Expose()
  @Type(() => Date)
  @Transform(params => {
    const { value } = params;
    if (!value) return new Date().toISOString();

    return value;
  })
  updatedAt!: string;
}

@Expose()
export class DeleteDocumentModel extends UpdateDocumentModel {
  @Expose()
  @Type(() => Date)
  @Transform(params => {
    const { value } = params;
    if (!value) return new Date().toISOString();

    return value;
  })
  deletedAt!: string;
}
