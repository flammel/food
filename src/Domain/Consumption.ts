import { Quantity } from "./Quantity";
import { NutritionData } from "./NutritionData";
import { nutritionData as recipeNutritionData } from "./Recipe";
import { emptyFood } from "./Food";
import { Consumable } from "./Consumable";
import { UUID, nilUUID } from "./UUID";

export type ConsumptionId = UUID;
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
        consumable: { type: "food", value: emptyFood },
        quantity: 1,
        isDeleted: false,
        sort: 0,
    };
}

export function nutritionData(consumption: Consumption): NutritionData {
    if (consumption.consumable.type === "food") {
        return {
            calories: (consumption.consumable.value.calories / 100) * consumption.quantity,
            fat: (consumption.consumable.value.fat / 100) * consumption.quantity,
            carbs: (consumption.consumable.value.carbs / 100) * consumption.quantity,
            protein: (consumption.consumable.value.protein / 100) * consumption.quantity,
        };
    } else {
        const nutrition = recipeNutritionData(consumption.consumable.value);
        const servings = consumption.consumable.value.servings;
        return {
            calories: (nutrition.calories / servings) * consumption.quantity,
            fat: (nutrition.fat / servings) * consumption.quantity,
            carbs: (nutrition.carbs / servings) * consumption.quantity,
            protein: (nutrition.protein / servings) * consumption.quantity,
        };
    }
}
