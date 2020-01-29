import { Food } from "../../../Domain/Food";
import { Recipe } from "../../../Domain/Recipe";
import { Consumption } from "../../../Domain/Consumption";
import {
    AppState,
    AppStateFoods,
    AppStateRecipes,
    AppStateConsumptions,
    JsonFood,
    JsonRecipe,
    JsonConsumption,
    JsonSettings,
    JsonData,
    JsonConsumable,
} from "./StorageTypes";
import { Settings } from "../../../Domain/Settings";
import { Consumable } from "../../../Domain/Consumable";
import isJsonData from "./Validator";
import { isUnit } from "../../../Domain/Unit";

function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

function readFood(json: JsonFood): Food | null {
    const unit = json.unit;
    if (!isUnit(unit)) {
        return null;
    }
    return {
        ...json,
        unit,
    };
}

function readFoods(json: JsonFood[]): AppStateFoods {
    const result: AppStateFoods = {};
    for (const item of json) {
        const food = readFood(item);
        if (food) {
            result[food.id] = food;
        }
    }
    return result;
}

function readRecipe(json: JsonRecipe, foods: AppStateFoods): Recipe | null {
    const ingredients = json.ingredients
        .map((ingredient) => {
            const food = foods[ingredient.foodId];
            if (!food) {
                console.error("Food not found", ingredient.foodId);
                return null;
            }
            return { ...ingredient, food };
        })
        .filter(notEmpty)
        .sort((a, b) => b.sort - a.sort);
    return {
        ...json,
        ingredients,
    };
}

function readRecipes(json: JsonRecipe[], foods: AppStateFoods): AppStateRecipes {
    const result: AppStateRecipes = {};
    for (const item of json) {
        const recipe = readRecipe(item, foods);
        if (recipe) {
            result[recipe.id] = recipe;
        }
    }
    return result;
}

function readConsumption(json: JsonConsumption, foods: AppStateFoods, recipes: AppStateRecipes): Consumption | null {
    const date = new Date(json.date);
    let consumable: Consumable;
    if (json.consumable.type === "food") {
        consumable = { type: "food", value: foods[json.consumable.id] };
    } else if (json.consumable.type === "recipe") {
        consumable = { type: "recipe", value: recipes[json.consumable.id] };
    } else {
        console.error("Invalid consumable type", json.consumable);
        return null;
    }
    if (!consumable) {
        console.error("Consumable not found", json.consumable);
        return null;
    }
    return {
        ...json,
        date,
        consumable,
    };
}

function readConsumptions(
    json: JsonConsumption[],
    foods: AppStateFoods,
    recipes: AppStateRecipes,
): AppStateConsumptions {
    const result: AppStateConsumptions = {};
    for (const item of json) {
        const consumption = readConsumption(item, foods, recipes);
        if (consumption) {
            result[consumption.id] = consumption;
        }
    }
    return result;
}

function readSettings(json: JsonSettings): Settings {
    return json;
}

function reviveJson(json: JsonData): AppState {
    const foods = readFoods(json.foods);
    const recipes = readRecipes(json.recipes, foods);
    const consumptions = readConsumptions(json.consumptions, foods, recipes);
    const settings = readSettings(json.settings);
    return { consumptions, foods, recipes, settings };
}

function setChecksum(json: string): void {
    window.sessionStorage.setItem("foodlog-checksum", json);
}

function loadJson(): JsonData {
    const json = window.localStorage.getItem("foodlog");
    if (json) {
        const parsed = JSON.parse(json);
        if (isJsonData(parsed)) {
            setChecksum(json);
            return parsed;
        } else {
            throw new Error("Data does not conform to schema");
        }
    }
    throw new Error("Data could not be loaded");
}

function jsonConsumable(consumable: Consumable): JsonConsumable {
    return {
        type: consumable.type,
        id: consumable.value.id,
    };
}

function serialize(state: AppState): JsonData {
    const foods = Object.values(state.foods);
    const recipes = Object.values(state.recipes).map((recipe) => {
        return {
            ...recipe,
            ingredients: recipe.ingredients.map((ingredient) => {
                const result = {
                    ...ingredient,
                    foodId: ingredient.food.id,
                };
                delete result.food;
                return result;
            }),
        };
    });
    const consumptions = Object.values(state.consumptions).map((consumption) => {
        return {
            ...consumption,
            date: consumption.date.toISOString(),
            consumable: jsonConsumable(consumption.consumable),
        };
    });
    return {
        foods,
        recipes,
        consumptions,
        settings: state.settings,
    };
}

function checksumIsOk(): boolean {
    const appState = window.localStorage.getItem("foodlog");
    const checksum = window.sessionStorage.getItem("foodlog-checksum");
    return appState === checksum;
}

export function loadAppState(): AppState {
    return reviveJson(loadJson());
}

export function storeAppState(newState: AppState): AppState {
    const json = JSON.stringify(serialize(newState));
    if (isJsonData(JSON.parse(json))) {
        if (checksumIsOk()) {
            setChecksum(json);
            window.localStorage.setItem("foodlog", json);
            return newState;
        } else {
            throw new Error("Checksum check failed");
        }
    } else {
        throw new Error("Persisting failed: Invalid JSON");
    }
}
