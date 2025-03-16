import { ModuleWithProviders, NgModule } from '@angular/core';
import { IFirebaseConfig } from './firebase.interface';
import { FirebaseService } from './firebase.service';
import { FIREBASE_CONFIG_TOKEN } from './firebase.enum';
import { FirebaseCollectionService } from './firebase-collection.service';

@NgModule({
    imports: [],
})
export class FirebaseModule {
    static forRoot(
        firebaseConfig: IFirebaseConfig
    ): ModuleWithProviders<FirebaseModule> {
        return {
            ngModule: FirebaseModule,
            providers: [
                {
                    provide: FIREBASE_CONFIG_TOKEN,
                    useValue: firebaseConfig,
                },
                FirebaseService,
                FirebaseCollectionService,
            ],
        };
    }
}
