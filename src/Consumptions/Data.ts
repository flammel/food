import { Quantity, NutritionData, Calories, NutritionValue } from "../Types";
import { recipeLabel, nutritionData as recipeNutritionData } from "../Recipes/Data";
import { Food, foodLabel, emptyFood } from "../Foods/Data";
import { Consumable } from "../Consumable";
import { UUID, nilUUID } from "../UUID";
import { dateToString } from "../Utilities";
import { AppState } from "../AppState/Types";

type ConsumptionId = UUID;
export interface Consumption {
    readonly id: ConsumptionId;
    readonly consumable: Consumable;
    readonly quantity: Quantity;
    readonly date: Date;
    readonly isDeleted: boolean;
    readonly sort: number;
}

export function emptyConsumption(date: Date): Consumption {
    return {
        id: nilUUID,
        date: date,
        consumable: emptyFood,
        quantity: 1,
        isDeleted: false,
        sort: 0,
    };
}

export function consumableIsFood(consumable: Consumable): consumable is Food {
    return consumable && Object.prototype.hasOwnProperty.call(consumable, "brand");
}

export function consumableLabel(consumable: Consumable): string {
    if (consumableIsFood(consumable)) {
        return foodLabel(consumable);
    } else {
        return recipeLabel(consumable);
    }
}

export function consumableUnit(consumable: Consumable, quantity: Quantity): string {
    if (consumableIsFood(consumable)) {
        return consumable.unit;
    } else {
        if (quantity === 1) {
            return "serving";
        } else {
            return "servings";
        }
    }
}

export function nutritionData(consumption: Consumption): NutritionData {
    if (consumableIsFood(consumption.consumable)) {
        return {
            calories:
                (consumption.consumable.calories / consumption.consumable.quantity) *
                consumption.quantity *
                consumption.consumable.servingSize,
            fat:
                (consumption.consumable.fat / consumption.consumable.quantity) *
                consumption.quantity *
                consumption.consumable.servingSize,
            carbs:
                (consumption.consumable.carbs / consumption.consumable.quantity) *
                consumption.quantity *
                consumption.consumable.servingSize,
            protein:
                (consumption.consumable.protein / consumption.consumable.quantity) *
                consumption.quantity *
                consumption.consumable.servingSize,
        };
    } else {
        const nutrition = recipeNutritionData(consumption.consumable);
        return {
            calories: (nutrition.calories / consumption.consumable.servings) * consumption.quantity,
            fat: (nutrition.fat / consumption.consumable.servings) * consumption.quantity,
            carbs: (nutrition.carbs / consumption.consumable.servings) * consumption.quantity,
            protein: (nutrition.protein / consumption.consumable.servings) * consumption.quantity,
        };
    }
}

export function formatCalories(calories: Calories): string {
    return isNaN(calories) ? "" : calories.toFixed(0);
}

export function formatNutritionValue(value: NutritionValue): string {
    return isNaN(value) ? "" : value.toFixed(1);
}

function dateFilter(filterDate: Date): (consumption: Consumption) => boolean {
    const filterDateString = dateToString(filterDate);
    return (consumption) => dateToString(consumption.date) === filterDateString;
}

export function consumptionsByDate(appState: AppState, date: Date): Consumption[] {
    return Object.values(appState.consumptions)
        .filter(dateFilter(date))
        .filter((consumption) => !consumption.isDeleted)
        .sort((a, b) => a.date.valueOf() - b.date.valueOf());
}
