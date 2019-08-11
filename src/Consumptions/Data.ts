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
        return recipeNutritionData(consumption.consumable);
    }
}

export function formatCalories(calories: Calories): string {
    return calories.toFixed(0);
}

export function formatNutritionValue(value: NutritionValue): string {
    return value.toFixed(0);
}
