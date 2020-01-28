import { Calories, Macro } from "./NutritionData";

export interface StatisticsDay {
    date: string;
    calories: Calories;
    fat: Macro;
    carbs: Macro;
    protein: Macro;
}

export interface Statistics {
    days: StatisticsDay[];
}

export const emptyStatistics: Statistics = {
    days: [],
};
