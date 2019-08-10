import { Food, FoodId } from "./Data";

function load(): Food[] {
    const items: Food[] = JSON.parse(window.localStorage.getItem("foods")) || [];
    return items.filter((i) => !i.next).filter((i) => !i.isDeleted);
}

function create(newFoodData: Food) {
    const id = Math.floor(Math.random() * 1000000);
    const newFood = { ...newFoodData, id };
    window.localStorage.setItem("foods", JSON.stringify([...load(), newFood]));
}

function update(food: Food) {
    const id = Math.floor(Math.random() * 1000000);
    const newFood = { ...food, id };
    window.localStorage.setItem(
        "foods",
        JSON.stringify([...load().map((i) => (i.id === food.id ? { ...i, next: newFood.id } : i)), newFood]),
    );
}

function remove(food: Food) {
    window.localStorage.setItem(
        "foods",
        JSON.stringify(load().map((i) => (i.id === food.id ? { ...food, isDeleted: true } : i))),
    );
}

function undoDelete(food: Food) {
    window.localStorage.setItem(
        "foods",
        JSON.stringify(load().map((i) => (i.id === food.id ? { ...food, isDeleted: false } : i))),
    );
}

function byId(id: FoodId): Food | null {
    for (const food of load()) {
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
}

