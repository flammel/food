import React from "react";
import { Consumption, nutritionData, formatCalories, formatNutritionValue } from "./Data";
import SettingsRepository from "../Settings/SettingsRepository";

interface ConsumptionsTableTotalsProps {
    consumptions: Consumption[];
}

export default function ConsumptionsTableTotals(props: ConsumptionsTableTotalsProps): React.ReactElement {
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
        <div className="consumptions-table--totals">
            <div className="data-table__row">
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-consumable">Totals</div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-quantity"></div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-calories">{formatCalories(calories)}</div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-fat">{formatNutritionValue(fat)}</div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-carbs">{formatNutritionValue(carbs)}</div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-protein">{formatNutritionValue(protein)}</div>
                <div className="data-table__cell data-table__cell--actions consumptions-table__cell--totals"></div>
            </div>

            <div className="data-table__row">
                <div className="data-table__cell data-table__cell--id-consumable">Targets</div>
                <div className="data-table__cell data-table__cell--id-quantity"></div>
                <div className="data-table__cell data-table__cell--id-calories">{formatCalories(settings.targetCalories)}</div>
                <div className="data-table__cell data-table__cell--id-fat">{formatNutritionValue(settings.targetFat)}</div>
                <div className="data-table__cell data-table__cell--id-carbs">{formatNutritionValue(settings.targetCarbs)}</div>
                <div className="data-table__cell data-table__cell--id-protein">{formatNutritionValue(settings.targetProtein)}</div>
                <div className="data-table__cell data-table__cell--actions"></div>
            </div>

            <div className="data-table__row">
                <div className="data-table__cell consumptions-table__cell--remaining data-table__cell--id-consumable">Remaining</div>
                <div className="data-table__cell consumptions-table__cell--remaining data-table__cell--id-quantity"></div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-calories " +
                        (settings.targetCalories - calories >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatCalories(settings.targetCalories - calories)}
                </div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-fat " +
                        (settings.targetFat - fat >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(settings.targetFat - fat)}
                </div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-carbs " +
                        (settings.targetCarbs - carbs >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(settings.targetCarbs - carbs)}
                </div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-protein " +
                        (settings.targetProtein - protein >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(settings.targetProtein - protein)}
                </div>
                <div className="data-table__cell data-table__cell--actions consumptions-table__cell--remaining"></div>
            </div>
        </div>
    );
}
