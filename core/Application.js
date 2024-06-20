import { createServer } from 'node:http';
import { EventEmitter } from 'node:events';

export class Application {
    constructor () {
        this.server = this.createServer();
        this.emitter = this.createEmitter();
    }

    addRouter (router) {
        Object.keys(router.endpoints).forEach(path => {
            const handler = router.endpoints[path];

            this.emitter.on(path, (request, response) => {
                handler(request, response);
            });
        })
    }

    createServer () {
        return createServer((request, response) => {
            const { pathname } = new URL('http://127.0.0.1:8080' + request.url);

            const eventName = `[${pathname}]:[${request.method.toLocaleLowerCase()}]`;

            const emitted = this.emitter.emit(eventName, request, response);

            if (!emitted) {
                response.end('Page not found')
            }
        });
    }

    createEmitter () {
        return new EventEmitter();
    }

    listen (port) {
        this.server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
}