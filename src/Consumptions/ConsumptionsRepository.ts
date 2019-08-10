import { Consumption, consumableIsFood, Consumable } from "./Data";
import { FoodId, emptyFood } from "../Foods/Data";
import { RecipeId } from "../Recipes/Data";
import FoodsRepository from "../Foods/FoodsRepository";
import RecipesRepository from "../Recipes/RecipesRepository";

interface SerializedConsumption extends Omit<Consumption, "consumable"> {
    foodId?: FoodId;
    recipeId?: RecipeId;
}

function fromJson(json: any): SerializedConsumption {
    return {
        ...json,
        date: new Date(json.date),
    };
}

function toJson(consumption: Consumption): SerializedConsumption {
    const json: any = { ...consumption };
    if (consumableIsFood(consumption.consumable)) {
        json.foodId = consumption.consumable.id;
    } else {
        json.recipeId = consumption.consumable.id;
    }
    delete json.consumable;
    return json;
}

function datesEqual(d1: Date, d2: Date): boolean {
    return (
        new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), 0, 0, 0, 0).getTime() ===
        new Date(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate(), 0, 0, 0, 0).getTime()
    );
}

function addConsumable(consumption: SerializedConsumption): Consumption {
    let consumable: Consumable;
    if (consumption.foodId) {
        consumable = FoodsRepository.byId(consumption.foodId);
    } else if (consumption.recipeId) {
        consumable = RecipesRepository.byId(consumption.recipeId);
    } else {
        consumable = emptyFood;
    }

    return { ...consumption, consumable };
}

function load(date?: Date): Consumption[] {
    const items: SerializedConsumption[] = JSON.parse(window.localStorage.getItem("consumptions")) || [];
    return items
        .map(fromJson)
        .filter((item) => !date || datesEqual(item.date, date))
        .filter((item) => !item.isDeleted)
        .map(addConsumable);
}

function create(consumption: Consumption) {
    const id = Math.floor(Math.random() * 1000000);
    window.localStorage.setItem("consumptions", JSON.stringify([...load(), toJson({ ...consumption, id })]));
}

function update(consumption: Consumption) {
    window.localStorage.setItem(
        "consumptions",
        JSON.stringify(load().map((c) => (c.id === consumption.id ? consumption : c))),
    );
}

function remove(consumption: Consumption) {
    window.localStorage.setItem(
        "consumptions",
        JSON.stringify(load().map((c) => (c.id === consumption.id ? toJson({ ...consumption, isDeleted: true }) : c))),
    );
}

function undoDelete(consumption: Consumption) {
    window.localStorage.setItem(
        "consumptions",
        JSON.stringify(load().map((c) => (c.id === consumption.id ? toJson({ ...consumption, isDeleted: false }) : c))),
    );
}

export default {
    load: load,
    create: create,
    update: update,
    delete: remove,
    undoDelete: undoDelete,
};
