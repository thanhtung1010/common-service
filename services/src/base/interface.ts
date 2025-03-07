import { IFirebaseConfig } from "../firebase/firebase.interface";

export interface IAppConfig {
  production: boolean;
  defaultLang: string;
  lang: string;
  tokenKey: string;
  assetsUrl: string;
  apiUrl: string;
  email: string;
  phoneNumber: string;
  defaultPageSize: number;
  timeoutMs: number;
  settingFormat: ISettingFormat;
  firebaseConfig: IFirebaseConfig;
  googleConfig: IGoogleConfig;
  remoteModuleUrl: IRemoteModuleUrl;
  [key: string]: any;
}

export interface ISettingFormat {
  dateTime: {
    date: string;
    time: string;
    dateTime: string;
    month: string;
    year: string;
  };
  [key: string]: any;
}

export interface IGoogleConfig {
  [key: string]: any;
}

export interface IRemoteModuleUrl {
  [key: string]: any;
}
