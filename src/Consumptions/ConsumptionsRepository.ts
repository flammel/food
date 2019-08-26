import { Consumption, consumableIsFood } from "./Data";
import { FoodId, emptyFood } from "../Foods/Data";
import { RecipeId } from "../Recipes/Data";
import FoodsRepository from "../Foods/FoodsRepository";
import RecipesRepository from "../Recipes/RecipesRepository";
import { Consumable } from "../Consumable";

interface SerializedConsumption extends Omit<Consumption, "consumable"> {
    foodId?: FoodId;
    recipeId?: RecipeId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromJson(json: any): SerializedConsumption {
    return {
        ...json,
        date: new Date(json.date),
    };
}

function toJson(consumption: Consumption): SerializedConsumption {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    let consumable: Consumable | null = null;
    if (consumption.foodId) {
        consumable = FoodsRepository.byId(consumption.foodId);
    } else if (consumption.recipeId) {
        consumable = RecipesRepository.byId(consumption.recipeId);
    }

    return { ...consumption, consumable: consumable || emptyFood };
}

function loadIncludingDeleted(date?: Date): Consumption[] {
    const json = window.localStorage.getItem("consumptions");
    if (json) {
        const parsed = JSON.parse(json);
        if (parsed) {
            return parsed
                .map(fromJson)
                .filter((item: SerializedConsumption) => !date || datesEqual(item.date, date))
                .map(addConsumable);
        }
    }
    return [];
}

function load(date?: Date): Consumption[] {
    return loadIncludingDeleted(date).filter((item) => !item.isDeleted);
}

function store(items: Consumption[]): void {
    window.localStorage.setItem("consumptions", JSON.stringify(items.map(toJson)));
}

function create(consumption: Consumption): void {
    const id = Math.floor(Math.random() * 1000000);
    store([{ ...consumption, id }, ...loadIncludingDeleted()]);
}

function update(consumption: Consumption): void {
    store(loadIncludingDeleted().map((c) => (c.id === consumption.id ? consumption : c)));
}

function remove(consumption: Consumption): void {
    store(loadIncludingDeleted().map((c) => (c.id === consumption.id ? { ...consumption, isDeleted: true } : c)));
}

function undoDelete(consumption: Consumption): void {
    store(loadIncludingDeleted().map((c) => (c.id === consumption.id ? { ...consumption, isDeleted: false } : c)));
}

function datesWithData(): Set<string> {
    return new Set(load().map((consumption) => consumption.date.toISOString().substr(0, 10)));
}

export default {
    load: load,
    create: create,
    update: update,
    delete: remove,
    undoDelete: undoDelete,
    datesWithData: datesWithData,
};
