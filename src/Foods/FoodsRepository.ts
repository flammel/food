import { Food, FoodId } from "./Data";

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
        .filter((i) => !i.isDeleted);
}

function create(newFoodData: Food): void {
    const id = Math.floor(Math.random() * 1000000);
    const newFood = { ...newFoodData, id };
    window.localStorage.setItem("foods", JSON.stringify([...loadIncludingDeleted(), newFood]));
}

function update(food: Food): void {
    const id = Math.floor(Math.random() * 1000000);
    const newFood = { ...food, id };
    window.localStorage.setItem(
        "foods",
        JSON.stringify([
            ...loadIncludingDeleted().map((i) => (i.id === food.id ? { ...i, next: newFood.id } : i)),
            newFood,
        ]),
    );
}

function remove(food: Food): void {
    window.localStorage.setItem(
        "foods",
        JSON.stringify(loadIncludingDeleted().map((i) => (i.id === food.id ? { ...food, isDeleted: true } : i))),
    );
}

function undoDelete(food: Food): void {
    window.localStorage.setItem(
        "foods",
        JSON.stringify(loadIncludingDeleted().map((i) => (i.id === food.id ? { ...food, isDeleted: false } : i))),
    );
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
