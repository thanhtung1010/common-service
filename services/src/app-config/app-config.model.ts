import { Exclude, Expose, Transform } from "class-transformer";
import { BaseModel } from "../base/base.model";
import { IAppConfig, IGoogleConfig, IRemoteModuleUrl, ISettingFormat } from "./app-config.interface";
import { IFirebaseConfig } from "../firebase/firebase.interface";

@Exclude()
export class AppConfigModel extends BaseModel implements IAppConfig {
  @Expose()
  production!: boolean;

  @Expose()
  defaultLang!: string;

  @Expose()
  lang!: string;

  @Expose()
  token!: string;

  @Expose()
  assetsUrl!: string;

  @Expose()
  apiUrl!: string;

  @Expose()
  email!: string;

  @Expose()
  phoneNumber!: string;

  @Expose()
  defaultPageSize!: number;

  @Expose()
  timeoutMs!: number;

  @Expose()
  settingFormat!: ISettingFormat;

  @Expose()
  @Transform(params => {
    return null;
  })
  firebaseConfig!: IFirebaseConfig;

  @Expose()
  googleConfig!: IGoogleConfig;

  @Expose()
  remoteModuleUrl!: IRemoteModuleUrl;

}
