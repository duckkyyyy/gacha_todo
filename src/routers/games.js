import { Router, DBJson } from '../../core/index.js';

const gamesRouter = new Router();

gamesRouter.get('/games', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    const DBGamesDaily = new DBJson('./src/db/games-daily.json');
    const DBDaily = new DBJson('./src/db/daily.json');
    const DBGames = new DBJson('./src/db/games.json');
    const DBDailyTasks = new DBJson('./src/db/daily-tasks.json');
    const DBTasks = new DBJson('./src/db/tasks.json');

    const result = DBGamesDaily.getAll().map(gameDaily => {
        // id игры
        const gameId = gameDaily.gameId;

        // id записи, где дейлик связан с задачами
        const gameDailyTasksId = gameDaily.dailyTasksId;

        // Нашли игру в базе игр
        const game = DBGames.findById(gameId);

        // Нашли запись дейлика с задачами
        const dailyTasks = DBDailyTasks.findById(gameDailyTasksId);

        // Нашли дейлик в базе дейликов
        const daily = DBDaily.findById(dailyTasks.dailyId);

        // Нашли задачи
        const tasks = DBTasks.getAll().filter(task => {
            return dailyTasks.tasks.includes(task.id);
        });

        return {
            gameName: game.name,
            daily: {
                name: daily.name,
                tasks
            }
        }
    });

    response.end(JSON.stringify(result));
});
gamesRouter.post('/games', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    let data = '';

    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const newGame = JSON.parse(data);

            const DBGames = new DBJson('./src/db/games.json');

            const success = DBGames.add(newGame);

            if (success) {
                response.end(JSON.stringify(DBGames.getAll()));
            } else {
                response.end('Не удалось добавить игру');
            }
        });
});

gamesRouter.put('/games', (request, response) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    let data = '';

    request
        .on('data', (chunck) => {
            data += chunck;
        })
        .on('end', () => {
            const url = new URL('http://127.0.0.1:8080' + request.url);
            const queryId = parseInt(url.searchParams.get('id'));

            const payload = JSON.parse(data);

            const DBGames = new DBJson('./src/db/games.json');

            const success = DBGames.updateById(queryId, payload);

            if (success) {
                response.end(JSON.stringify(DBGames.getAll()));
            } else {
                response.end('Не удалось обновить данные игры');
            }
        });
});


export {
    gamesRouter
};