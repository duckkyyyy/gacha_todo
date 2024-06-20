export class Router {
    constructor () {
        this.endpoints = {};
    }

    getRouteMask (url, method) {
        return `[${url}]:[${method}]`;
    }

    requrest (url, method, callback) {
        const enpointKey = this.getRouteMask(url, method);

        if (!this.endpoints[enpointKey]) {
            this.endpoints[enpointKey] = callback;
        } else {
            throw new Error('Такой адрес уже объявлен');
        }
    }

    get (url, callback) {
        this.requrest(url, 'get', callback);
    }

    post (url, callback) {
        this.requrest(url, 'post', callback);
    }

    put (url, callback) {
        this.requrest(url, 'put', callback);
    }

    delete (url, callback) {
        this.requrest(url, 'delete', callback);
    }
}