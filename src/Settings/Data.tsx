import { Calories, NutritionValue } from "../Types";

export interface Settings {
    targetCalories: Calories;
    targetFat: NutritionValue;
    targetCarbs: NutritionValue;
    targetProtein: NutritionValue;
}

export const emptySettings: Settings = {
    targetCalories: 0,
    targetFat: 0,
    targetCarbs: 0,
    targetProtein: 0,
};
