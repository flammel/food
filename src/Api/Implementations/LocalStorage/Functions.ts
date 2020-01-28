import { Statistics, StatisticsDay } from "../../../Domain/Statistics";
import { AppState } from "./StorageTypes";
import { Food } from "../../../Domain/Food";
import { Recipe } from "../../../Domain/Recipe";
import { dateToString } from "../../../Utilities";
import { Consumption, nutritionData } from "../../../Domain/Consumption";

export function sortedFoods(appState: AppState): Food[] {
    return Object.values(appState.foods)
        .filter((food) => !food.isDeleted)
        .sort((a, b) => b.sort - a.sort);
}

export function sortedRecipes(appState: AppState): Recipe[] {
    return Object.values(appState.recipes)
        .filter((recipe) => !recipe.isDeleted)
        .sort((a, b) => b.sort - a.sort);
}

export function datesWithConsumptions(appState: AppState): Set<string> {
    return new Set(
        Object.values(appState.consumptions)
            .filter((consumption) => !consumption.isDeleted)
            .map((c) => dateToString(c.date)),
    );
}

export function consumptionsByDate(appState: AppState, date: Date): Consumption[] {
    return Object.values(appState.consumptions)
        .filter((consumption) => dateToString(consumption.date) === dateToString(date))
        .filter((consumption) => !consumption.isDeleted)
        .sort((a, b) => b.sort - a.sort);
}

export function getStatistics(appState: AppState): Statistics {
    const dates = [...datesWithConsumptions(appState)].sort();
    if (dates.length === 0) {
        return { days: [] };
    }
    const reducer = (acc: StatisticsDay, curr: Consumption): StatisticsDay => {
        const data = nutritionData(curr);
        return {
            date: acc.date,
            calories: acc.calories + data.calories,
            fat: acc.fat + data.fat,
            carbs: acc.carbs + data.carbs,
            protein: acc.protein + data.protein,
        };
    };
    const today = new Date();
    const current = new Date(dates[0]);
    const result: { [key: string]: StatisticsDay } = {};
    while (dateToString(current) < dateToString(today)) {
        result[dateToString(current)] = consumptionsByDate(appState, current).reduce(reducer, {
            date: dateToString(current),
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0,
        });
        current.setDate(current.getDate() + 1);
    }
    return { days: Object.values(result).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)) };
}
