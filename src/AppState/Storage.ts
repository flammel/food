import { Food } from "../Foods/Data";
import { Recipe } from "../Recipes/Data";
import { Consumption, consumableIsFood } from "../Consumptions/Data";
import { isUnit, notEmpty } from "../Types";
import { AppState, AppStateFoods, AppStateRecipes, AppStateConsumptions } from "./Types";
import { Settings } from "../Settings/Data";
import { dateToString } from "../Utilities";
import Ajv from "ajv";
import { Consumable } from "../Consumable";

interface JsonFood {
    readonly id: string;
    readonly name: string;
    readonly brand: string;
    readonly quantity: number;
    readonly servingSize: number;
    readonly unit: string;
    readonly isDeleted: boolean;
    readonly sort: number;
    readonly calories: number;
    readonly fat: number;
    readonly carbs: number;
    readonly protein: number;
}

type JsonConsumable = { type: "food"; id: string } | { type: "recipe"; id: string };

interface JsonConsumption {
    readonly id: string;
    readonly consumable: JsonConsumable;
    readonly quantity: number;
    readonly date: string;
    readonly sort: number;
    readonly isDeleted: boolean;
}

interface JsonIngredient {
    readonly id: string;
    readonly foodId: string;
    readonly quantity: number;
    readonly sort: number;
    readonly isDeleted: boolean;
}

interface JsonRecipe {
    readonly id: string;
    readonly name: string;
    readonly servings: number;
    readonly ingredients: JsonIngredient[];
    readonly isDeleted: boolean;
    readonly sort: number;
}

interface JsonSettings {
    targetCalories: number;
    targetFat: number;
    targetCarbs: number;
    targetProtein: number;
}

interface JsonData {
    foods: JsonFood[];
    recipes: JsonRecipe[];
    consumptions: JsonConsumption[];
    settings: JsonSettings;
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
    let consumable;
    if (json.consumable.type === "food") {
        consumable = foods[json.consumable.id];
    } else if (json.consumable.type === "recipe") {
        consumable = recipes[json.consumable.id];
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
    const datesWithConsumptions = new Set(Object.values(consumptions).map((c) => dateToString(c.date)));
    return { consumptions, foods, recipes, settings, datesWithConsumptions };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJsonData(json: any): json is JsonData {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile({
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "https://foodlog.florianlammel.com/foodlog.schema.json",
        title: "Foodlog",
        description: "Foodlog",
        type: "object",
        properties: {
            foods: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        brand: { type: "string" },
                        quantity: { type: "number" },
                        servingSize: { type: "number" },
                        unit: { type: "string" },
                        isDeleted: { type: "boolean" },
                        sort: { type: "number" },
                        calories: { type: "number" },
                        fat: { type: "number" },
                        carbs: { type: "number" },
                        protein: { type: "number" },
                    },
                    additionalProperties: false,
                    required: [
                        "id",
                        "name",
                        "brand",
                        "quantity",
                        "servingSize",
                        "unit",
                        "isDeleted",
                        "sort",
                        "calories",
                        "fat",
                        "carbs",
                        "protein",
                    ],
                },
            },
            recipes: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        servings: { type: "number" },
                        ingredients: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    foodId: { type: "string" },
                                    quantity: { type: "number" },
                                    isDeleted: { type: "boolean" },
                                    sort: { type: "number" },
                                },
                                additionalProperties: false,
                                required: ["id", "foodId", "quantity", "isDeleted", "sort"],
                            },
                        },
                        isDeleted: { type: "boolean" },
                        sort: { type: "number" },
                    },
                    additionalProperties: false,
                    required: ["id", "name", "servings", "ingredients", "isDeleted", "sort"],
                },
            },
            consumptions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        consumable: {
                            type: "object",
                            properties: {
                                type: { type: "string" },
                                id: { type: "string" },
                            },
                            additionalProperties: false,
                            required: ["type", "id"],
                        },
                        quantity: { type: "number" },
                        date: { type: "string" },
                        isDeleted: { type: "boolean" },
                        sort: { type: "number" },
                    },
                    additionalProperties: false,
                    required: ["id", "consumable", "quantity", "date", "isDeleted", "sort"],
                },
            },
            settings: {
                type: "object",
                properties: {
                    targetCalories: {
                        type: "number",
                    },
                    targetFat: {
                        type: "number",
                    },
                    targetCarbs: {
                        type: "number",
                    },
                    targetProtein: {
                        type: "number",
                    },
                },
                additionalProperties: false,
                required: ["targetCalories", "targetFat", "targetCarbs", "targetProtein"],
            },
        },
        additionalProperties: false,
        required: ["foods", "recipes", "consumptions", "settings"],
    });
    const valid = validate(json);
    if (valid) {
        return true;
    } else {
        console.error("Data is invalid", validate.errors);
        return false;
    }
}

function loadJson(): Promise<JsonData> {
    return new Promise((resolve, reject) => {
        const json = window.localStorage.getItem("foodlog");
        if (json) {
            const parsed = JSON.parse(json);
            if (isJsonData(parsed)) {
                resolve(parsed);
            } else {
                reject("Data does not conform to schema");
            }
        }
        reject("Data could not be loaded");
    });
}

function jsonConsumable(consumable: Consumable): JsonConsumable {
    if (consumableIsFood(consumable)) {
        return {
            type: "food",
            id: consumable.id,
        };
    } else {
        return {
            type: "recipe",
            id: consumable.id,
        };
    }
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

export function loadAppState(): Promise<AppState> {
    return loadJson().then((json) => reviveJson(json));
}

export function storeAppState(newState: AppState): Promise<AppState> {
    return new Promise((resolve, reject) => {
        const jsonData = serialize(newState);
        if (isJsonData(jsonData)) {
            window.localStorage.setItem("foodlog", JSON.stringify(jsonData));
            resolve(newState);
        } else {
            console.error("Did not save invalid JSON");
            reject("Persisting failed");
        }
    });
}
