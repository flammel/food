import React, { useContext, useEffect, useRef } from "react";
import { AppStateContext } from "../../AppState/Context";
import { Calories, NutritionValue } from "../../Types";
import { dateToString } from "../../Utilities";
import { formatCalories, formatNutritionValue } from "../../Types";
import { AppState } from "../../AppState/Types";
import { Consumption, nutritionData } from "../../Consumptions/Data";
import { datesWithConsumptions, consumptionsByDate } from "../../AppState/Functions";

interface StatisticsDay {
    date: string;
    calories: Calories;
    fat: NutritionValue;
    carbs: NutritionValue;
    protein: NutritionValue;
}
function getStatisticsDays(appState: AppState): StatisticsDay[] {
    const dates = [...datesWithConsumptions(appState).values()].sort();
    if (dates.length === 0) {
        return [];
    }
    const reducer = (acc: StatisticsDay, curr: Consumption): StatisticsDay => {
        const data = nutritionData(curr);
        return {
            date: acc.date,
            calories: acc.calories + data.calories,
            fat: acc.fat + data.fat,
            carbs: acc.carbs + data.carbs,
            protein: acc.protein + data.protein,
        };
    };
    const today = new Date();
    const current = new Date(dates[0]);
    const result: { [key: string]: StatisticsDay } = {};
    while (dateToString(current) < dateToString(today)) {
        result[dateToString(current)] = consumptionsByDate(appState, current).reduce(reducer, {
            date: dateToString(current),
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0,
        });
        current.setDate(current.getDate() + 1);
    }
    return Object.values(result).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export default function StatisticsPage(): React.ReactElement {
    const [appState] = useContext(AppStateContext);
    const days = getStatisticsDays(appState);
    const plotlyDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const data = [
            {
                x: days.map((day) => day.date),
                y: days.map((day) => formatCalories(day.calories)),
                name: "Calories",
                type: "scatter",
            },
            {
                x: days.map((day) => day.date),
                y: days.map((day) => formatNutritionValue(day.fat)),
                name: "Fat",
                yaxis: "y2",
                type: "scatter",
            },
            {
                x: days.map((day) => day.date),
                y: days.map((day) => formatNutritionValue(day.carbs)),
                name: "Carbs",
                yaxis: "y2",
                type: "scatter",
            },
            {
                x: days.map((day) => day.date),
                y: days.map((day) => formatNutritionValue(day.protein)),
                name: "Protein",
                yaxis: "y2",
                type: "scatter",
            },
        ];

        const layout = {
            yaxis: {
                title: "Calories",
            },
            yaxis2: {
                title: "Macros",
                side: "right",
                overlaying: "y",
            },
        };

        Plotly.newPlot(plotlyDivRef.current, data, layout);
    }, [plotlyDivRef.current, days]);

    return (
        <>
            <div ref={plotlyDivRef}></div>
            <div className="statistics-container">
                <div className="data-table statistics-table">
                    <div className="data-table__row data-table__row--header">
                        <div className="data-table__cell data-table__cell--header data-table__cell--id-date">Date</div>
                        <div className="data-table__cell data-table__cell--header data-table__cell--id-calories">
                            Calories
                        </div>
                        <div className="data-table__cell data-table__cell--header data-table__cell--id-fat">Fat</div>
                        <div className="data-table__cell data-table__cell--header data-table__cell--id-carbs">
                            Carbs
                        </div>
                        <div className="data-table__cell data-table__cell--header data-table__cell--id-protein">
                            Protein
                        </div>
                    </div>
                    {days.map((day) => (
                        <div className="data-table__row data-table__row--show" key={day.date}>
                            <div className="data-table__cell  data-table__cell--id-date">
                                <span className="data-table__value">{day.date}</span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-calories">
                                <span
                                    className={
                                        "data-table__value " +
                                        (appState.settings.targetCalories - day.calories >= 0
                                            ? "text-success"
                                            : "text-danger")
                                    }
                                >
                                    {day.calories === 0 ? "" : formatCalories(day.calories)}
                                </span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-fat">
                                <span
                                    className={
                                        "data-table__value " +
                                        (appState.settings.targetFat - day.fat >= 0 ? "text-success" : "text-danger")
                                    }
                                >
                                    {day.fat === 0 ? "" : formatNutritionValue(day.fat)}
                                </span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-carbs">
                                <span
                                    className={
                                        "data-table__value " +
                                        (appState.settings.targetCarbs - day.carbs >= 0
                                            ? "text-success"
                                            : "text-danger")
                                    }
                                >
                                    {day.carbs === 0 ? "" : formatNutritionValue(day.carbs)}
                                </span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-protein">
                                <span
                                    className={
                                        "data-table__value " +
                                        (appState.settings.targetProtein - day.protein >= 0
                                            ? "text-success"
                                            : "text-danger")
                                    }
                                >
                                    {day.protein === 0 ? "" : formatNutritionValue(day.protein)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <h1>Export</h1>
                <textarea
                    className="statistics-textarea"
                    readOnly
                    value={days
                        .map(
                            (day) =>
                                day.date +
                                "\t" +
                                formatCalories(day.calories) +
                                "\t" +
                                formatNutritionValue(day.fat) +
                                "\t" +
                                formatNutritionValue(day.carbs) +
                                "\t" +
                                formatNutritionValue(day.protein),
                        )
                        .join("\n")}
                ></textarea>
            </div>
        </>
    );
}
