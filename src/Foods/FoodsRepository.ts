import { Food, FoodId } from "./Data";
import { uuidv4 } from "../UUID";

function loadIncludingDeleted(): Food[] {
    const json = window.localStorage.getItem("foods");
    if (json) {
        const parsed = JSON.parse(json);
        if (parsed) {
            return parsed;
        }
    }
    return [];
}

function load(): Food[] {
    return loadIncludingDeleted()
        .filter((i) => !i.next)
        .filter((i) => !i.isDeleted)
        .sort((a, b) => a.sort - b.sort);
}

function store(items: Food[]): void {
    window.localStorage.setItem("foods", JSON.stringify(items));
}

function create(food: Food): void {
    const sort = new Date().valueOf();
    store([{ ...food, id: uuidv4(), sort }, ...loadIncludingDeleted()]);
}

function update(food: Food): void {
    const newFood = { ...food, id: uuidv4() };
    store([...loadIncludingDeleted().map((i) => (i.id === food.id ? { ...i, next: newFood.id } : i)), newFood]);
}

function remove(food: Food): void {
    store(loadIncludingDeleted().map((i) => (i.id === food.id ? { ...food, isDeleted: true } : i)));
}

function undoDelete(food: Food): void {
    store(loadIncludingDeleted().map((i) => (i.id === food.id ? { ...food, isDeleted: false } : i)));
}

function byId(id: FoodId): Food | null {
    for (const food of loadIncludingDeleted()) {
        if (food.id === id) {
            return food;
        }
    }
    return null;
}

export default {
    load: load,
    create: create,
    update: update,
    delete: remove,
    undoDelete: undoDelete,
    byId: byId,
};
