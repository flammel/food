import React, { useEffect, useRef, useState, useContext } from "react";
import { Statistics, emptyStatistics } from "../../Domain/Statistics";
import { emptySettings, Settings } from "../../Domain/Settings";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { MenuButton } from "../TopBar/TopBar";

export default function StatisticsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const [statistics, setStatistics] = useState<Statistics>(emptyStatistics);
    const [settings, setSettings] = useState<Settings>(emptySettings);
    const plotlyDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            const result = await api.statistics.load();
            setStatistics(result);
        };
        const fetchSettings = async () => {
            const result = await api.settings.load();
            setSettings(result);
        };
        fetchStatistics();
        fetchSettings();
    }, []);

    useEffect(() => {
        const data = [
            {
                x: statistics.days.map((day) => day.date),
                y: statistics.days.map((day) => Formatter.calories(day.calories)),
                name: "Calories",
                type: "scatter",
            },
            {
                x: statistics.days.map((day) => day.date),
                y: statistics.days.map((day) => Formatter.macro(day.fat)),
                name: "Fat",
                yaxis: "y2",
                type: "scatter",
            },
            {
                x: statistics.days.map((day) => day.date),
                y: statistics.days.map((day) => Formatter.macro(day.carbs)),
                name: "Carbs",
                yaxis: "y2",
                type: "scatter",
            },
            {
                x: statistics.days.map((day) => day.date),
                y: statistics.days.map((day) => Formatter.macro(day.protein)),
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
    }, [plotlyDivRef.current, statistics]);

    return (
        <>
            <TopBar>
                <MenuButton />
                Statistics
            </TopBar>
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
                    {statistics.days.map((day) => (
                        <div className="data-table__row data-table__row--show" key={day.date}>
                            <div className="data-table__cell  data-table__cell--id-date">
                                <span className="data-table__value">{day.date}</span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-calories">
                                <span
                                    className={
                                        "data-table__value " +
                                        (settings.targetCalories - day.calories >= 0 ? "text-success" : "text-danger")
                                    }
                                >
                                    {day.calories === 0 ? "" : Formatter.calories(day.calories)}
                                </span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-fat">
                                <span
                                    className={
                                        "data-table__value " +
                                        (settings.targetFat - day.fat >= 0 ? "text-success" : "text-danger")
                                    }
                                >
                                    {day.fat === 0 ? "" : Formatter.macro(day.fat)}
                                </span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-carbs">
                                <span
                                    className={
                                        "data-table__value " +
                                        (settings.targetCarbs - day.carbs >= 0 ? "text-success" : "text-danger")
                                    }
                                >
                                    {day.carbs === 0 ? "" : Formatter.macro(day.carbs)}
                                </span>
                            </div>
                            <div className="data-table__cell  data-table__cell--id-protein">
                                <span
                                    className={
                                        "data-table__value " +
                                        (settings.targetProtein - day.protein >= 0 ? "text-success" : "text-danger")
                                    }
                                >
                                    {day.protein === 0 ? "" : Formatter.macro(day.protein)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <h1>Export</h1>
                <textarea
                    className="statistics-textarea"
                    readOnly
                    value={statistics.days
                        .map(
                            (day) =>
                                day.date +
                                "\t" +
                                Formatter.calories(day.calories) +
                                "\t" +
                                Formatter.macro(day.fat) +
                                "\t" +
                                Formatter.macro(day.carbs) +
                                "\t" +
                                Formatter.macro(day.protein),
                        )
                        .join("\n")}
                ></textarea>
            </div>
        </>
    );
}
