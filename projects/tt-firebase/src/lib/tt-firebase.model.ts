import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseModel, Default } from './base.model';
import { IFBCreateDocument, IFBDeleteDocument, IFBUpdateDocument, IInitFirebase } from './tt-firebase.interface';
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

@Exclude()
export class BaseFBCreateDocumentModel extends BaseModel implements IFBCreateDocument {
  @Expose()
  @Type(() => Date)
  @Transform(params => {
    const { value } = params;
    if (!value) return new Date();

    return value;
  })
  createdAt!: Date;
}

@Exclude()
export class BaseFBUpdateDocumentModel extends BaseModel implements IFBUpdateDocument {

  @Expose()
  @Type(() => Date)
  @Transform(params => {
    const { value } = params;
    if (!value) return new Date();

    return value;
  })
  updatedAt!: Date;
}

@Exclude()
export class BaseFBDeleteDocumentModel extends BaseModel implements IFBDeleteDocument {
  @Expose()
  @Type(() => Date)
  @Transform(params => {
    const { value } = params;
    if (!value) return new Date();

    return value;
  })
  deletedAt!: Date;
}
