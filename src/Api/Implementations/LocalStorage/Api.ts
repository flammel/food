import Fuse from "fuse.js";
import { Api } from "../../Interfaces";
import { Statistics } from "../../../Domain/Statistics";
import { Consumption, ConsumptionId } from "../../../Domain/Consumption";
import { Recipe, RecipeId } from "../../../Domain/Recipe";
import { Settings } from "../../../Domain/Settings";
import { Food, FoodId, Brand } from "../../../Domain/Food";
import { Consumable } from "../../../Domain/Consumable";
import { loadAppState, storeAppState } from "./Storage";
import { uuidv4 } from "../../../Domain/UUID";
import { AppState } from "./StorageTypes";
import { getStatistics, datesWithConsumptions, consumptionsByDate, sortedRecipes, sortedFoods } from "./Functions";

let currentAppState = loadAppState();

function setState(diff: (prev: AppState) => Partial<AppState>): Promise<void> {
    return new Promise((res, _err) => {
        const diffed = diff(currentAppState);
        currentAppState = { ...currentAppState, ...diffed };
        storeAppState(currentAppState);
        res();
    });
}

function getState<T>(fn: (current: AppState) => T): Promise<T> {
    return new Promise((res, _err) => {
        res(fn(currentAppState));
    });
}

const api: Api = {
    consumptions: {
        load: async (date: Date): Promise<Consumption[]> => {
            return getState((appState) => consumptionsByDate(appState, date));
        },
        create: async (consumption: Consumption): Promise<void> => {
            const id = uuidv4();
            return setState((prev) => ({
                consumptions: {
                    ...prev.consumptions,
                    [id]: { ...consumption, id, sort: new Date().valueOf() },
                },
            }));
        },
        update: async (consumption: Consumption): Promise<void> => {
            return setState((prev) => ({ consumptions: { ...prev.consumptions, [consumption.id]: consumption } }));
        },
        delete: async (consumption: Consumption): Promise<void> => {
            return setState((prev) => ({
                consumptions: {
                    ...prev.consumptions,
                    [consumption.id]: { ...consumption, isDeleted: true },
                },
            }));
        },
        undoDelete: async (consumption: Consumption): Promise<void> => {
            return setState((prev) => ({
                consumptions: {
                    ...prev.consumptions,
                    [consumption.id]: { ...consumption, isDeleted: false },
                },
            }));
        },
        loadDatesWithData: async (): Promise<Set<string>> => {
            return getState(datesWithConsumptions);
        },
        read: async (id: ConsumptionId): Promise<Consumption> => {
            return getState((appState) => appState.consumptions[id]);
        },
    },
    consumables: {
        autocomplete: async (search: string): Promise<Consumable[]> => {
            const allConsumables = await getState((appState) => [
                ...sortedFoods(appState).map((food): Consumable => ({type: "food", value: food})),
                ...sortedRecipes(appState).map((recipe): Consumable => ({type: "recipe", value: recipe}))
            ]);
            const fuse = new Fuse(allConsumables, {
                keys: ["value.name", "value.brand"],
            });
            return fuse.search(search);
        },
    },
    foods: {
        load: async (): Promise<Food[]> => {
            return getState((appState) => sortedFoods(appState));
        },
        create: async (food: Food): Promise<void> => {
            const id = uuidv4();
            return setState((prev) => ({
                foods: {
                    ...prev.foods,
                    [id]: { ...food, id, sort: new Date().valueOf() },
                },
            }));
        },
        update: async (food: Food): Promise<void> => {
            return setState((prev) => ({ foods: { ...prev.foods, [food.id]: food } }));
        },
        delete: async (food: Food): Promise<void> => {
            return setState((prev) => ({ foods: { ...prev.foods, [food.id]: { ...food, isDeleted: true } } }));
        },
        undoDelete: async (food: Food): Promise<void> => {
            return setState((prev) => ({ foods: { ...prev.foods, [food.id]: { ...food, isDeleted: false } } }));
        },
        autocomplete: async (_str: string): Promise<Food[]> => {
            return getState(sortedFoods);
        },
        read: async (id: FoodId): Promise<Food> => {
            return getState((appState) => appState.foods[id]);
        },
    },
    recipes: {
        load: async (): Promise<Recipe[]> => {
            return getState(sortedRecipes);
        },
        create: async (recipe: Recipe): Promise<void> => {
            const id = uuidv4();
            return setState((prev) => ({
                recipes: {
                    ...prev.recipes,
                    [id]: { ...recipe, id, sort: new Date().valueOf() },
                },
            }));
        },
        update: async (recipe: Recipe): Promise<void> => {
            return setState((prev) => ({ recipes: { ...prev.recipes, [recipe.id]: recipe } }));
        },
        delete: async (recipe: Recipe): Promise<void> => {
            return setState((prev) => ({ recipes: { ...prev.recipes, [recipe.id]: { ...recipe, isDeleted: true } } }));
        },
        undoDelete: async (recipe: Recipe): Promise<void> => {
            return setState((prev) => ({ recipes: { ...prev.recipes, [recipe.id]: { ...recipe, isDeleted: false } } }));
        },
        duplicate: async (recipe: Recipe): Promise<void> => {
            const id = uuidv4();
            return setState((prev) => ({
                recipes: { ...prev.recipes, [id]: { ...recipe, id, sort: new Date().valueOf() } },
            }));
        },
        read: async (id: RecipeId): Promise<Recipe> => {
            return getState((appState) => appState.recipes[id]);
        },
    },
    settings: {
        load: async (): Promise<Settings> => {
            return getState((appState) => appState.settings);
        },
        update: async (settings: Settings): Promise<void> => {
            return setState((_prev) => ({ settings }));
        },
    },
    statistics: {
        load: async (): Promise<Statistics> => {
            return getState(getStatistics);
        },
    },
    brands: {
        autocomplete: async (search: string): Promise<Brand[]> => {
            const allBrands = await getState((appState) => [...new Set(sortedFoods(appState).map(food => food.brand))]);
            const fuse = new Fuse(
                allBrands.map(brand => ({id: brand, name: brand})),
                {keys: ["name"]}
            );
            const result = fuse.search(search);
            return result.map(brand => brand.name);
        },
    },
};

export default api;
