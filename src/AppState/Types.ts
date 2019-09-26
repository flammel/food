import { Consumption } from "../Consumptions/Data";
import { Recipe } from "../Recipes/Data";
import { Settings } from "../Settings/Data";
import { Food } from "../Foods/Data";

interface MapOf<ItemType> {
    [key: string]: ItemType;
}

export type Action = (appState: AppState) => AppState;
export type AppStateConsumptions = MapOf<Consumption>;
export type AppStateFoods = MapOf<Food>;
export type AppStateRecipes = MapOf<Recipe>;

export interface AppState {
    consumptions: AppStateConsumptions;
    datesWithConsumptions: Set<string>;
    foods: AppStateFoods;
    recipes: AppStateRecipes;
    settings: Settings;
}
