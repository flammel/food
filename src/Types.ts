export type Quantity = number;
export type Calories = number;
export type NutritionValue = number;
export type Unit = "ml" | "g";

export interface NutritionData {
    readonly calories: Calories;
    readonly fat: NutritionValue;
    readonly carbs: NutritionValue;
    readonly protein: NutritionValue;
}

export function formatQuantity(quantity: Quantity): string {
    if (isNaN(quantity)) {
        return "";
    }
    return quantity.toFixed(0);
}

export function formatCalories(calories: Calories): string {
    return calories.toFixed(0);
}

export function formatNutritionValue(value: NutritionValue): string {
    return value.toFixed(1);
}

export function isUnit(value: string): value is Unit {
    return value === "g" || value === "ml";
}
