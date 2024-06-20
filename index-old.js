import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';

function bodyParser (request) {
    let result = '';

    return new Promise((resolve, reject) => {
        request
            .on('data', (chunk) => {
                result += chunk;
            })
            .on('end', () => {
                resolve(JSON.parse((result)));
            });
    });
}

function readJsonFile (path) {
    return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJsonFile (path, data) {
    writeFileSync(path, JSON.stringify(data));
}

function send (response, data) {
    response.end(JSON.stringify(data));
}

const server = createServer(async (request, response) => {
    const url = new URL('http://localhost:8080' + request.url);
    const method = request.method;

    response.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
    });

    if (url.pathname === '/catalog') {
        if (method === 'GET') {
            const products = readJsonFile('./products.json');

            send(response, products);
        } else if (method === 'POST') {
            const data = await bodyParser(request);
            const oldProducts = readJsonFile('./products.json');
            const hasId = oldProducts.find(product => product.id === data.id);

            if (!hasId) {
                oldProducts.push(data);

                writeJsonFile('./products.json', oldProducts);

                send(response, oldProducts);
            } else {
                response.end(`Товар с id ${newProduct.id} уже есть в базе`);
            }
        } else if (method === 'DELETE') {
            const data = await bodyParser(request);
            const oldProducts = readJsonFile('./products.json');
            const hasId = oldProducts.find(product => product.id === data.id);

            if (hasId) {
                const newProducts = oldProducts.filter(product => product.id !== data.id)

                writeJsonFile('./products.json', newProducts);

                send(response, newProducts);
            } else {
                response.end(`Товар с id ${newProduct.id} не существует`);
            }
        } else if (method === 'PUT') {
            const data = await bodyParser(request);
            const oldProducts = readJsonFile('./products.json');
            const id = parseInt(url.searchParams.get('id'));
            
            const currentProduct = oldProducts.find(product => product.id === id);

            if (currentProduct) {
                currentProduct.name = data.name;

                writeJsonFile('./products.json', oldProducts);

                send(response, oldProducts);
            } else {
                response.end('Такой товар не найден');
            }
        } else { 
            response.end(`${method} - ${url}`);
        } 
    }
});

server.listen(8080, () => {
    console.log('Server started on port 8080');
});