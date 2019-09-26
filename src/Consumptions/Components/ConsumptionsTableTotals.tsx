import React from "react";
import { Consumption, nutritionData, formatCalories, formatNutritionValue } from "../Data";
import { Settings } from "../../Settings/Data";

interface ConsumptionsTableTotalsProps {
    consumptions: Consumption[];
    settings: Settings;
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
    return (
        <div className="consumptions-table--totals">
            <div className="data-table__row">
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-consumable">
                    Totals
                </div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-quantity"></div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-calories">
                    {formatCalories(calories)}
                </div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-fat">
                    {formatNutritionValue(fat)}
                </div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-carbs">
                    {formatNutritionValue(carbs)}
                </div>
                <div className="data-table__cell consumptions-table__cell--totals data-table__cell--id-protein">
                    {formatNutritionValue(protein)}
                </div>
                <div className="data-table__cell data-table__cell--actions consumptions-table__cell--totals"></div>
            </div>

            <div className="data-table__row">
                <div className="data-table__cell data-table__cell--id-consumable">Targets</div>
                <div className="data-table__cell data-table__cell--id-quantity"></div>
                <div className="data-table__cell data-table__cell--id-calories">
                    {formatCalories(props.settings.targetCalories)}
                </div>
                <div className="data-table__cell data-table__cell--id-fat">
                    {formatNutritionValue(props.settings.targetFat)}
                </div>
                <div className="data-table__cell data-table__cell--id-carbs">
                    {formatNutritionValue(props.settings.targetCarbs)}
                </div>
                <div className="data-table__cell data-table__cell--id-protein">
                    {formatNutritionValue(props.settings.targetProtein)}
                </div>
                <div className="data-table__cell data-table__cell--actions"></div>
            </div>

            <div className="data-table__row">
                <div className="data-table__cell consumptions-table__cell--remaining data-table__cell--id-consumable">
                    Remaining
                </div>
                <div className="data-table__cell consumptions-table__cell--remaining data-table__cell--id-quantity"></div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-calories " +
                        (props.settings.targetCalories - calories >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatCalories(props.settings.targetCalories - calories)}
                </div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-fat " +
                        (props.settings.targetFat - fat >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(props.settings.targetFat - fat)}
                </div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-carbs " +
                        (props.settings.targetCarbs - carbs >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(props.settings.targetCarbs - carbs)}
                </div>
                <div
                    className={
                        "data-table__cell consumptions-table__cell--remaining data-table__cell--id-protein " +
                        (props.settings.targetProtein - protein >= 0 ? "text-success" : "text-danger")
                    }
                >
                    {formatNutritionValue(props.settings.targetProtein - protein)}
                </div>
                <div className="data-table__cell data-table__cell--actions consumptions-table__cell--remaining"></div>
            </div>
        </div>
    );
}
