import { Consumption } from "../../../Domain/Consumption";
import { Food } from "../../../Domain/Food";
import { Recipe } from "../../../Domain/Recipe";
import { Settings } from "../../../Domain/Settings";

interface MapOf<ItemType> {
    [key: string]: ItemType;
}

export type Action = (appState: AppState) => AppState;
export type AppStateConsumptions = MapOf<Consumption>;
export type AppStateFoods = MapOf<Food>;
export type AppStateRecipes = MapOf<Recipe>;

export interface AppState {
    consumptions: AppStateConsumptions;
    foods: AppStateFoods;
    recipes: AppStateRecipes;
    settings: Settings;
}

export interface JsonFood {
    readonly id: string;
    readonly name: string;
    readonly brand: string;
    readonly defaultQuantity: number;
    readonly unit: string;
    readonly isDeleted: boolean;
    readonly sort: number;
    readonly calories: number;
    readonly fat: number;
    readonly carbs: number;
    readonly protein: number;
}

export type JsonConsumable = { type: "food"; id: string } | { type: "recipe"; id: string };

export interface JsonConsumption {
    readonly id: string;
    readonly consumable: JsonConsumable;
    readonly quantity: number;
    readonly date: string;
    readonly sort: number;
    readonly isDeleted: boolean;
}

export interface JsonIngredient {
    readonly id: string;
    readonly foodId: string;
    readonly quantity: number;
    readonly sort: number;
    readonly isDeleted: boolean;
}

export interface JsonRecipe {
    readonly id: string;
    readonly name: string;
    readonly servings: number;
    readonly ingredients: JsonIngredient[];
    readonly isDeleted: boolean;
    readonly sort: number;
}

export interface JsonSettings {
    targetCalories: number;
    targetFat: number;
    targetCarbs: number;
    targetProtein: number;
}

export interface JsonData {
    foods: JsonFood[];
    recipes: JsonRecipe[];
    consumptions: JsonConsumption[];
    settings: JsonSettings;
}
