// version 2.0.0
import S from './Main';

export default class Ajax {

    static GET: string = 'get';
    static POST: string = 'post';
    static STATUS_OK: number = 0;

    ajax: XMLHttpRequest = new XMLHttpRequest();
    method: string = S.Strings.EMPTY;
    url: string = S.Strings.EMPTY;
    async: boolean = true;
    headers: Header[] = [];
    requestQueryBuiler: RequestQueryBuilder = new RequestQueryBuilder();

    readyState: number = S.NOT_EXISTS;
    status: number = S.NOT_EXISTS;
    responseText: string | null = null;
    wiped: boolean = false;

    onResponse: null | ((responseText: string) => void) = null;
    onResponseJson: null | ((json: any) => void) = null;
    onResponseData: null | ((data: any) => void) = null;
    onProgress: null | ((e: ProgressEvent) => void) = null;
    onError: null | ((status: number, responseText: string | null) => void) = null;
    onWipe: null | (() => void) = null;

    enableActions: null | (() => void) = null;
    disableActions: null | (() => void) = null;

    constructor(enableActions: null | (() => void) = null, disableActions: null | (() => void) = null) {
        this.enableActions = enableActions;
        this.disableActions = disableActions;

        this.ajax.onreadystatechange = this.listener.bind(this);
        this.ajax.onprogress = this.onProgressListener.bind(this);
    }

    open(method: string, url: string, async: boolean) {
        this.method = method;
        this.url = url;
        this.async = (async === undefined ? true : async);
        if (this.method === Ajax.POST) {
            this.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
    }

    setRequestHeader(name: string, value: string) {
        this.headers.push(new Header(name, value));
    }

    setResponseType(responseType: XMLHttpRequestResponseType) {
        this.ajax.responseType = responseType;
    }

    addParam(key: string, value: string) {
        this.requestQueryBuiler.add(key, value);
    }

    getResponseHeader(name: string) {
        return this.ajax.getResponseHeader(name);
    }

    send() {
        let header;

        if (this.disableActions !== null) {
            this.disableActions();
        }

        this.ajax.open(this.method, this.url + (this.method === Ajax.GET ? `?${this.requestQueryBuiler.build()}` : S.Strings.EMPTY), this.async);
        for (let i = this.headers.length - 1; i >= 0; --i) {
            header = this.headers[i];
            this.ajax.setRequestHeader(header.name, header.value);
        }
        this.ajax.send((this.method === Ajax.POST ? this.requestQueryBuiler.build() : S.Strings.EMPTY));
    }

    listener() {
        if (this.wiped === true) {
            if (this.onWipe !== null) {
                this.onWipe();
            }
            return;
        }

        this.readyState = this.ajax.readyState;
        this.status = this.ajax.status;
        if (this.ajax.readyState !== 4) {
            return;
        }

        if (this.enableActions !== null) {
            this.enableActions();
        }

        switch (this.ajax.responseType) {
            case S.Strings.EMPTY:
            case 'text':
                this.responseText = this.ajax.responseText;
                break;
            default:
                this.responseText = this.ajax.response;
        }

        if (this.ajax.status !== 200 || this.responseText === null) {
            if (this.onError !== null) {
                this.onError(this.status, this.responseText);
            }
            return;
        }

        if (this.onResponse !== null) {
            this.onResponse(this.responseText);
            return;
        }

        const json = JSON.parse(this.responseText);
        if (this.onResponseJson !== null) {
            this.onResponseJson(json);
        }

        if (json.status === Ajax.STATUS_OK && this.onResponseData !== null) {
            this.onResponseData(json.obj);
        }
    }

    onProgressListener(e: ProgressEvent) {
        if (this.onProgress !== null) {
            this.onProgress(e);
        }
    }

    wipe() {
        this.wiped = true;
        if (this.enableActions !== null) {
            this.enableActions();
        }
    }

}

class RequestQueryBuilder {

    params: string[] = [];

    add(key: string, value: string) {
        this.params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }

    build() {
        return this.params.join('&');
    }
}

class Header {

    name: string;
    value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

}
