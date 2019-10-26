import { Consumption } from "../Consumptions/Data";
import { Consumable } from "../Consumable";
import { Settings } from "../Settings/Data";
import { Food } from "../Foods/Data";
import { Recipe, RecipeId } from "../Recipes/Data";
import { Statistics } from "../Statistics/Data";

interface ConsumptionsApi {
    load: (date: Date) => Promise<Consumption[]>;
    create: (consumption: Consumption) => Promise<void>;
    update: (consumption: Consumption) => Promise<void>;
    delete: (consumption: Consumption) => Promise<void>;
    undoDelete: (consumption: Consumption) => Promise<void>;
    loadDatesWithData: () => Promise<Set<string>>;
}

interface ConsumablesApi {
    autocomplete: (str: string) => Promise<Consumable[]>;
}

interface FoodsApi {
    load: () => Promise<Food[]>;
    create: (food: Food) => Promise<void>;
    update: (food: Food) => Promise<void>;
    delete: (food: Food) => Promise<void>;
    undoDelete: (food: Food) => Promise<void>;
    autocomplete: (str: string) => Promise<Food[]>;
}

interface RecipesApi {
    load: () => Promise<Recipe[]>;
    create: (recipe: Recipe) => Promise<void>;
    update: (recipe: Recipe) => Promise<void>;
    delete: (recipe: Recipe) => Promise<void>;
    undoDelete: (recipe: Recipe) => Promise<void>;
    duplicate: (recipe: Recipe) => Promise<void>;
    read: (id: RecipeId) => Promise<Recipe>;
}

interface SettingsApi {
    load: () => Promise<Settings>;
    update: (settings: Settings) => Promise<void>;
}

interface StatisticsApi {
    load: () => Promise<Statistics>;
}

export interface Api {
    consumptions: ConsumptionsApi;
    consumables: ConsumablesApi;
    foods: FoodsApi;
    recipes: RecipesApi;
    settings: SettingsApi;
    statistics: StatisticsApi;
}
