import { Calories, NutritionValue } from "../Types";

export interface StatisticsDay {
    date: string;
    calories: Calories;
    fat: NutritionValue;
    carbs: NutritionValue;
    protein: NutritionValue;
}

export interface Statistics {
    days: StatisticsDay[];
}

export const emptyStatistics: Statistics = {
    days: [],
};
