export class CookieStorageHelper {
  private static CookieStorageHelper: any = {};

  /**
   * Set cookie
   * @param key Key name of cookie
   * @param value Value string for cookie
   * @param domain Domain to apply
   * @param expires Expires time: Date string format
   * @param maxAge Others way to set expires and cookie will be deleted
   */
  public set(
    key: string,
    value: string,
    domain?: string,
    path?: string,
    expires?: string,
    maxAge?: number
  ) {
    // eslint-disable-next-line max-len
    const _cookieStr = `${key}=${value || ""}${
      domain ? ";domain=" + domain : ""
    }${expires ? ";max-age=" + expires : ""}${
      maxAge ? ";max-age=" + maxAge : ""
    }${path ? ";path=" + path : ";path=/;"}`;
    document.cookie = _cookieStr;
  }

  public get(key: string) {
    this.parseCookies();
    return !!CookieStorageHelper.CookieStorageHelper[key]
      ? CookieStorageHelper.CookieStorageHelper[key]
      : null;
  }

  public parseCookies(cookies = document.cookie) {
    CookieStorageHelper.CookieStorageHelper = {};
    if (!!cookies === false) {
      return;
    }
    const cookiesArr = cookies.split(";");
    for (const cookie of cookiesArr) {
      const cookieArr = cookie.split("=");
      CookieStorageHelper.CookieStorageHelper[cookieArr[0].trim()] = cookieArr[1];
    }
  }

  public remove(key: string) {
    document.cookie = `${key}=;;domain=${"localhost"};expires=Thu, 1 jan 1990 12:00:00 UTC; path=/`;
  }

  public clearAll() {
    const cookies = document.cookie.split("; ");

    for (let cookie of cookies) {
      const index = cookie.indexOf("=");

      const name = ~index ? cookie.substring(0, index) : cookie;

      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }
}
