import { Quantity, NutritionData, Calories, NutritionValue } from "../Types";
import { Recipe, recipeLabel, nutritionData as recipeNutritionData } from "../Recipes/Data";
import { Food, foodLabel } from "../Foods/Data";

export type Consumable = Food | Recipe;

type ConsumptionId = number;
export interface Consumption {
    readonly id: ConsumptionId;
    readonly consumable: Consumable;
    readonly quantity: Quantity;
    readonly date: Date;
    readonly isDeleted: boolean;
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

export function consumableUnit(consumable: Consumable): string {
    if (consumableIsFood(consumable)) {
        return consumable.unit;
    } else {
        return "servings";
    }
}

export function nutritionData(consumption: Consumption): NutritionData {
    if (consumableIsFood(consumption.consumable)) {
        return {
            calories: (consumption.consumable.calories / consumption.consumable.quantity) * consumption.quantity,
            fat: (consumption.consumable.fat / consumption.consumable.quantity) * consumption.quantity,
            carbs: (consumption.consumable.carbs / consumption.consumable.quantity) * consumption.quantity,
            protein: (consumption.consumable.protein / consumption.consumable.quantity) * consumption.quantity,
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
    return isNaN(calories) ? "" :  calories.toFixed(0);
}

export function formatNutritionValue(value: NutritionValue): string {
    return isNaN(value) ? "" : value.toFixed(1);
}
