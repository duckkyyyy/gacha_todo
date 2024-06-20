import { Application } from './core/index.js';
import { gamesRouter } from './src/routers/index.js';

const server = new Application();


server.addRouter(gamesRouter);


server.listen(8080);