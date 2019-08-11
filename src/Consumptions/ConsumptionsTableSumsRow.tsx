import React from "react";
import { Consumption, nutritionData, formatCalories, formatNutritionValue } from "./Data";
import SettingsRepository from "../Settings/SettingsRepository";

interface ConsumptionsTableSumsRowProps {
    consumptions: Consumption[];
}

export default function ConsumptionsTableSumsRow(props: ConsumptionsTableSumsRowProps): React.ReactElement {
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
    const settings = SettingsRepository.load();
    return (
        <>
            <div className="data-table__row">
                <div className="data-table__cell data-table__cell--food consumptions-table__cell--totals">Totals</div>
                <div className="data-table__cell data-table__cell--quantity consumptions-table__cell--totals"></div>
                <div className="data-table__cell data-table__cell--calories consumptions-table__cell--totals">
                    {formatCalories(calories)}
                </div>
                <div className="data-table__cell data-table__cell--fat consumptions-table__cell--totals">
                    {formatNutritionValue(fat)}
                </div>
                <div className="data-table__cell data-table__cell--carbs consumptions-table__cell--totals">
                    {formatNutritionValue(carbs)}
                </div>
                <div className="data-table__cell data-table__cell--protein consumptions-table__cell--totals">
                    {formatNutritionValue(protein)}
                </div>
                <div className="data-table__cell data-table__cell--actions consumptions-table__cell--totals"></div>
            </div>

            <div className="data-table__row">
                <div className="data-table__cell data-table__cell--food">Targets</div>
                <div className="data-table__cell data-table__cell--quantity"></div>
                <div className="data-table__cell data-table__cell--calories">
                    {formatCalories(settings.targetCalories)}
                </div>
                <div className="data-table__cell data-table__cell--fat">{formatNutritionValue(settings.targetFat)}</div>
                <div className="data-table__cell data-table__cell--carbs">
                    {formatNutritionValue(settings.targetCarbs)}
                </div>
                <div className="data-table__cell data-table__cell--protein">
                    {formatNutritionValue(settings.targetProtein)}
                </div>
                <div className="data-table__cell data-table__cell--actions"></div>
            </div>

            <div className="data-table__row">
                <div className="data-table__cell data-table__cell--food consumptions-table__cell--remaining">
                    Remaining
                </div>
                <div className="data-table__cell data-table__cell--quantity consumptions-table__cell--remaining"></div>
                <div
                    className={
                        "data-table__cell data-table__cell--calories consumptions-table__cell--remaining " +
                        (settings.targetCalories - calories >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatCalories(settings.targetCalories - calories)}
                </div>
                <div
                    className={
                        "data-table__cell data-table__cell--fat consumptions-table__cell--remaining " +
                        (settings.targetFat - fat >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(settings.targetFat - fat)}
                </div>
                <div
                    className={
                        "data-table__cell data-table__cell--carbs consumptions-table__cell--remaining " +
                        (settings.targetCarbs - carbs >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(settings.targetCarbs - carbs)}
                </div>
                <div
                    className={
                        "data-table__cell data-table__cell--protein consumptions-table__cell--remaining " +
                        (settings.targetProtein - protein >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(settings.targetProtein - protein)}
                </div>
                <div className="data-table__cell data-table__cell--actions consumptions-table__cell--remaining"></div>
            </div>
        </>
    );
}
