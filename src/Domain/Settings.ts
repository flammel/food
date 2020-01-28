import { Macro, Calories } from "./NutritionData";

export interface Settings {
    targetCalories: Calories;
    targetFat: Macro;
    targetCarbs: Macro;
    targetProtein: Macro;
}

export const emptySettings: Settings = {
    targetCalories: 0,
    targetFat: 0,
    targetCarbs: 0,
    targetProtein: 0,
};
