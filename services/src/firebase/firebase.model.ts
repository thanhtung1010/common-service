import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseModel, Default } from '../base/model';
import { IInitFirebase } from './firebase.interface';
import { AuthErrorMap, browserLocalPersistence, browserPopupRedirectResolver, Dependencies, Persistence, PopupRedirectResolver } from 'firebase/auth';

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
