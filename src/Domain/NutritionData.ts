export type Calories = number;
export type Macro = number;
export interface NutritionData {
    readonly calories: Calories;
    readonly fat: Macro;
    readonly carbs: Macro;
    readonly protein: Macro;
}
