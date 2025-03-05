import { ModuleWithProviders, NgModule } from "@angular/core";
import { IFirebaseConfig } from "./tt-firebase.interface";
import { TTFirebaseService } from "./tt-firebase.service";
import { FIREBASE_CONFIG_TOKEN } from "./tt-firebase.enum";

@NgModule({
  imports: [],
})

export class TTFirebaseModule {

  static forRoot(firebaseConfig: IFirebaseConfig): ModuleWithProviders<TTFirebaseModule> {
    return {
      ngModule: TTFirebaseModule,
      providers: [
        {
          provide: FIREBASE_CONFIG_TOKEN,
          useValue: firebaseConfig,
        },
        TTFirebaseService,
      ]
    }
  }
}
