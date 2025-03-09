import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../app-config/app-config.service';
import { CookieStorageHelper, IApiBaseResponse, IApiObject } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(
    private readonly http: HttpClient,
    private appConfigService: AppConfigService,
  ) { }

  buildCountryURI(external: boolean, url: string) {
    if (external) {
      return url;
    }
    return `${this.appConfigService.config.value?.apiUrl}${url}`;
  }

  setHeader(_customHeader?: any, url?: string) {
    const appConfig = this.appConfigService.config.value;
    let _cookie = new CookieStorageHelper();
    let access_token = _cookie.get(appConfig.token || '');
    let headers: HttpHeaders = new HttpHeaders();

    if (!!access_token) {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    headers = headers.append('Content-Language', _cookie.get(appConfig?.lang || ''));
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('X-Time-Zone', Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (_customHeader) {
      for (let d in _customHeader) {
        headers = headers.set(d, _customHeader[d])
      }
    }
    return headers;
  }
  setInit(customHeader: any, customParams?: any, notReplaceHeader: boolean = false, url?: string) {
    const headers = notReplaceHeader ? customHeader : this.setHeader(customHeader, url);
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: undefined,// 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
    };
    if (customParams) {
      _init = { ..._init, ...customParams }
    }
    return _init;
  }

  callApi(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildCountryURI(!!object.external, object.url);
      const initials = this.setInit(customHeader, customParams, false, _url);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  callApiWithFile(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildCountryURI(!!object.external, object.url);
      const initials = this.setInit(customHeader, customParams);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption);
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  callApiWithCustomHeader(object: IApiObject, body: any, customHeader?: any, customParams?: any) {
    try {
      const _url = this.buildCountryURI(!!object.external, object.url);
      const initials = this.setInit(customHeader, customParams, true);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  //#region  Upload File
  callApiUpload(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildCountryURI(!!object.external, object.url);
      const initials = this.setInitUpload(customParams);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  setHeaderUpload() {
    const appConfig = this.appConfigService.config.value;
    let _cookie = new CookieStorageHelper();
    let access_token = _cookie.get(appConfig.token || '');
    let headers: HttpHeaders = new HttpHeaders();

    if (!!access_token) {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    headers = headers.append('Content-Language', _cookie.get(appConfig?.lang || ''));
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('Timezone-Offset', Helpers.timezone());
    // headers = headers.append('language', Helpers.getCurrentLang());
    // headers = headers.append('Origin-Url', window.location.hostname)
    return headers;
  }

  setInitUpload(customParams?: any) {
    const headers = this.setHeaderUpload();
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: undefined,// 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
    };
    if (customParams) {
      _init = { ..._init, ...customParams }
    }
    return _init;
  }

  //#endregion

  //#region Download ZIP File
  callZIPArchive(object: IApiObject, body: any, customHeader?: any, customParams?: any): Observable<any> {
    try {
      const _url = this.buildCountryURI(!!object.external, object.url);
      const initials = this.setInitZIPArchive(customParams);
      const reqOption = new HttpRequest(object.method, _url, body, initials);
      return this.http.request(reqOption).pipe(
        map((response: any) => {
          if (response && response.status === 200 && response['body']) {
            return response.body as IApiBaseResponse;
          } else {
            return response;
          }
        })
      );
    } catch (error) {
      console.log('=== [ERROR CALL API]', error);
      return new Observable(undefined);
    }
  }

  setHeaderZIPArchive() {
    const appConfig = this.appConfigService.config.value;
    let _cookie = new CookieStorageHelper();
    let access_token = _cookie.get(appConfig.token || '');
    let headers: HttpHeaders = new HttpHeaders();

    if (!!access_token) {
      headers = headers.append('Authorization', `Bearer ${access_token}`);
    }
    headers = headers.append('Content-Language', _cookie.get(appConfig?.lang || ''));
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('Timezone-Offset', Helpers.timezone());
    // headers = headers.append('language', Helpers.getCurrentLang());
    // headers = headers.append('Origin-Url', window.location.hostname)
    return headers;
  }

  setInitZIPArchive(customParams?: any) {
    const headers = this.setHeaderUpload();
    let _init = {
      headers: headers,
      withCredentials: undefined,
      reportProgress: undefined,
      responseType: "blob" as const,// 'arraybuffer'|'blob'|'json'|'text',
      observe: undefined
    };
    if (customParams) {
      _init = { ..._init, ...customParams }
    }
    return _init;
  }

  //#endregion

}
