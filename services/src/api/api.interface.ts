export interface IApiObject {
    /**
     * API url
     * @example api/v1/user/get-list
     */
    url: string;
    /**
     * Method of api
     */
    method:
        | 'DELETE'
        | 'GET'
        | 'HEAD'
        | 'JSONP'
        | 'OPTIONS'
        | 'POST'
        | 'PUT'
        | 'PATCH';
    /**
     * Authorize or not
     * @default false
     */
    authorize?: boolean;
    /**
     * If need to call direct to external not need join with api app
     * @default false
     */
    external?: boolean;
}

export interface IApiBaseResponse {
    data: any;
    message: string;
    message_code: number;
    status: string;
    meta: IApiBaseMeta;
}

export interface IApiBaseMeta {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements?: number;
}
