import { readFileSync, writeFileSync } from 'node:fs';

export class DBJson {
    constructor (path) {
        this.path = path;
    }

    // Получение всех записей
    getAll () {
        return JSON.parse(readFileSync(this.path, 'utf-8'));
    }

    // Найти запись по id
    findById (id) {
        const data = this.getAll();
        
        return data.find(item => item.id === id);
    }

    // Добавить запись 
    add (payload) {
        if (!payload.id) {
            return false;
        }

        const data = this.getAll();

        const hasItem = data.find(item => item.id === payload.id);

        if (hasItem) {
            return false;
        } else {
            data.push(payload);

            writeFileSync(this.path, JSON.stringify(data));

            return true;
        }
    }

    // Удалить запись 
    deleteById (id) {
        const data = this.getAll();

        const hasItem = data.find(item => item.id === id);

        if (hasItem) {
            const newData = data.filter(item => item.id !== id);

            writeFileSync(this.path, JSON.stringify(newData));

            return true;
        } else {
            return false;
        }
    }

    // Обновить запись 
    updateById (id, payload) {
        const data = this.getAll();

        const item = data.find(item => item.id === id);
        const itemIndex = data.findIndex(item => item.id === id);

        if (item) {
            const updatedItem = {
                ...item,
                ...payload
            };

            data[itemIndex] = updatedItem;

            writeFileSync(this.path, JSON.stringify(data));

            return true;
        } else {
            return false;
        }
    }
}