import { Calories, NutritionValue } from "../Types";

export interface Settings {
    targetCalories: Calories;
    targetFat: NutritionValue;
    targetCarbs: NutritionValue;
    targetProtein: NutritionValue;
}
