import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseDto, Default } from '../base/base.dto';
import {
    FIREBASE_AUTH_PROVIDER,
    IDocumentData,
    IFirebaseUser,
    IFirebaseUserMetadata,
    IInitFirebase,
} from './firebase.interface';
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
export class FirebaseUserDto extends BaseDto implements IFirebaseUser {
    @Expose()
    uid!: string;

    @Expose()
    @Transform((params) => {
        const obj: User = params.obj;
        return obj.providerData?.map((pr) => pr.providerId);
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
    @Type(() => FirebaseUserMetadataDto)
    metadata!: FirebaseUserMetadataDto;
}

@Expose()
export class FirebaseUserMetadataDto
    extends BaseDto
    implements IFirebaseUserMetadata
{
    @Expose()
    creationTime?: string;

    @Expose()
    lastSignInTime?: string;
}

@Exclude()
export class InitFirebaseDto extends BaseDto implements IInitFirebase {
    @Expose()
    @Default(true)
    auth!: boolean;

    @Expose()
    @Default(true)
    store!: boolean;

    @Expose()
    initializeAppName?: string;

    @Expose()
    @Type(() => AuthDependenciesDto)
    authDependencies?: AuthDependenciesDto;
}

@Exclude()
export class AuthDependenciesDto extends BaseDto implements Dependencies {
    @Expose()
    persistence: Persistence | Persistence[] = browserLocalPersistence;

    @Expose()
    popupRedirectResolver: PopupRedirectResolver = browserPopupRedirectResolver;

    @Expose()
    errorMap?: AuthErrorMap;
}

@Expose()
export class DocumentDataDto extends BaseDto implements IDocumentData {
    @Expose()
    firebaseId!: string;

    @Expose()
    updatedAt?: string;

    @Expose()
    deletedAt?: string;

    @Expose()
    createdById?: string;

    @Expose()
    createdAt?: string;
}

@Expose()
export class CreateDocumentDto extends BaseDto {
    @Expose()
    createdById?: string;

    @Expose()
    @Type(() => Date)
    @Transform((params) => {
        const { value } = params;
        if (!value) return new Date().toISOString();

        return value;
    })
    createdAt!: string;
}

@Expose()
export class UpdateDocumentDto extends BaseDto {
    @Expose()
    firebaseId!: string;

    @Expose()
    @Type(() => Date)
    @Transform((params) => {
        const { value } = params;
        if (!value) return new Date().toISOString();

        return value;
    })
    updatedAt!: string;
}

@Expose()
export class DeleteDocumentDto extends UpdateDocumentDto {
    @Expose()
    @Type(() => Date)
    @Transform((params) => {
        const { value } = params;
        if (!value) return new Date().toISOString();

        return value;
    })
    deletedAt!: string;
}
