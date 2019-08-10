import React from "react";
import { Consumption, nutritionData } from "./Data";
import { formatCalories, formatNutritionValue } from "../Types";

interface ConsumptionsTableSumsRowProps {
    consumptions: Consumption[];
}

export default function ConsumptionsTableSumsRow(props: ConsumptionsTableSumsRowProps) {
    let calories = 0;
    let fat = 0.0;
    let carbs = 0.0;
    let protein = 0.0;
    for (const consumption of props.consumptions) {
        const values = nutritionData(consumption);
        calories += values.calories;
        fat += values.fat;
        carbs += values.carbs;
        protein += values.protein;
    }
    return (
        <div className="data-table__row">
            <div className="data-table__cell data-table__cell--food consumptions-table__cell--sums"></div>
            <div className="data-table__cell data-table__cell--quantity consumptions-table__cell--sums"></div>
            <div className="data-table__cell data-table__cell--calories consumptions-table__cell--sums">
                {formatCalories(calories)}
            </div>
            <div className="data-table__cell data-table__cell--fat consumptions-table__cell--sums">
                {formatNutritionValue(fat)} g
            </div>
            <div className="data-table__cell data-table__cell--carbs consumptions-table__cell--sums">
                {formatNutritionValue(carbs)} g
            </div>
            <div className="data-table__cell data-table__cell--protein consumptions-table__cell--sums">
                {formatNutritionValue(protein)} g
            </div>
            <div className="data-table__cell data-table__cell--actions consumptions-table__cell--sums"></div>
        </div>
    );
}
