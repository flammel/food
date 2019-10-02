import { AppState } from "./Types";
import { Consumption } from "../Consumptions/Data";
import { dateToString } from "../Utilities";
import { Consumable } from "../Consumable";
import { Brand, Food } from "../Foods/Data";
import { Recipe } from "../Recipes/Data";

function dateFilter(filterDate: Date): (consumption: Consumption) => boolean {
    const filterDateString = dateToString(filterDate);
    return (consumption) => dateToString(consumption.date) === filterDateString;
}

export function consumptionsByDate(appState: AppState, date: Date): Consumption[] {
    return Object.values(appState.consumptions)
        .filter(dateFilter(date))
        .filter((consumption) => !consumption.isDeleted)
        .sort((a, b) => b.sort - a.sort);
}

export function consumablesForSelect(appState: AppState): Consumable[] {
    return [...sortedFoods(appState), ...sortedRecipes(appState)];
}

export function sortedFoods(appState: AppState): Food[] {
    return Object.values(appState.foods)
        .filter((food) => !food.isDeleted)
        .sort((a, b) => b.sort - a.sort);
}

export function brands(appState: AppState): Brand[] {
    return Array.from(new Set(sortedFoods(appState).map((f) => f.brand)));
}

export function sortedRecipes(appState: AppState): Recipe[] {
    return Object.values(appState.recipes)
        .filter((recipe) => !recipe.isDeleted)
        .sort((a, b) => b.sort - a.sort);
}
