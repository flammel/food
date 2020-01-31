import React, { useEffect, useRef, useState, useContext } from "react";
import { Statistics, emptyStatistics } from "../../Domain/Statistics";
import { emptySettings, Settings } from "../../Domain/Settings";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { MenuButton, Title } from "../TopBar/TopBar";
import { dateToString } from "../../Utilities";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    ResponsiveContainer,
} from "recharts";

function StatisticsCharts(props: { statistics: Statistics; settings: Settings }): React.ReactElement {
    const data = props.statistics.days.reverse().map(day => ({
        date: day.date,
        calories: day.calories,
        fat: parseFloat(Formatter.macro(day.fat)),
        carbs: parseFloat(Formatter.macro(day.carbs)),
        protein: parseFloat(Formatter.macro(day.protein)),
    }))
    return (
        <>
            <div className="statistics-chart">
                <ResponsiveContainer>
                    <LineChart data={data} syncId="statisticsCharts">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 'dataMax']} />
                        <Tooltip />
                        <Line type="linear" isAnimationActive={false} dataKey="calories" stroke="#8884d8" fill="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="statistics-chart statistics-chart--brush">
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        syncId="statisticsCharts"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 'dataMax']} />
                        <Tooltip formatter={(v) => typeof v === "number" ? Formatter.macro(v) : v} />
                        <Line type="linear" isAnimationActive={false} dataKey="carbs" stroke="#8884d8" fill="#8884d8" />
                        <Line type="linear" isAnimationActive={false} dataKey="fat" stroke="#82ca9d" fill="#82ca9d" />
                        <Line type="linear" isAnimationActive={false} dataKey="protein" stroke="#ffc658" fill="#ffc658" />
                        <Brush height={32}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

function StatisticsTable(props: { statistics: Statistics; settings: Settings }): React.ReactElement {
    return (
        <div className="data-table statistics-table">
            <div className="data-table__row data-table__row--header">
                <div className="data-table__cell data-table__cell--header data-table__cell--id-date">Date</div>
                <div className="data-table__cell data-table__cell--header data-table__cell--id-calories">Calories</div>
                <div className="data-table__cell data-table__cell--header data-table__cell--id-fat">Fat</div>
                <div className="data-table__cell data-table__cell--header data-table__cell--id-carbs">Carbs</div>
                <div className="data-table__cell data-table__cell--header data-table__cell--id-protein">Protein</div>
            </div>
            {props.statistics.days.map((day) => (
                <div className="data-table__row data-table__row--show" key={day.date}>
                    <div className="data-table__cell data-table__cell--id-date">
                        <span className="data-table__value">{day.date}</span>
                    </div>
                    <div className="data-table__cell data-table__cell--id-calories">
                        <span
                            className={
                                "data-table__value " +
                                (props.settings.targetCalories - day.calories >= 0 ? "text-success" : "text-danger")
                            }
                        >
                            {day.calories === 0 ? "" : Formatter.calories(day.calories)}
                        </span>
                    </div>
                    <div className="data-table__cell data-table__cell--id-fat">
                        <span
                            className={
                                "data-table__value " +
                                (props.settings.targetFat - day.fat >= 0 ? "text-success" : "text-danger")
                            }
                        >
                            {day.calories === 0 ? "" : Formatter.macro(day.fat)}
                        </span>
                    </div>
                    <div className="data-table__cell data-table__cell--id-carbs">
                        <span
                            className={
                                "data-table__value " +
                                (props.settings.targetCarbs - day.carbs >= 0 ? "text-success" : "text-danger")
                            }
                        >
                            {day.calories === 0 ? "" : Formatter.macro(day.carbs)}
                        </span>
                    </div>
                    <div className="data-table__cell data-table__cell--id-protein">
                        <span
                            className={
                                "data-table__value " +
                                (props.settings.targetProtein - day.protein >= 0 ? "text-success" : "text-danger")
                            }
                        >
                            {day.calories === 0 ? "" : Formatter.macro(day.protein)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function StatisticsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const [statistics, setStatistics] = useState<Statistics>(emptyStatistics);
    const [settings, setSettings] = useState<Settings>(emptySettings);
    const plotlyDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStatistics = async (): Promise<void> => {
            const result = await api.statistics.load();
            setStatistics(result);
        };
        const fetchSettings = async (): Promise<void> => {
            const result = await api.settings.load();
            setSettings(result);
        };
        fetchStatistics();
        fetchSettings();
    }, []);

    return (
        <>
            <TopBar>
                <MenuButton />
                <Title>Statistics</Title>
            </TopBar>
            <div ref={plotlyDivRef}></div>
            <div className="container">
                <StatisticsCharts statistics={statistics} settings={settings} />
                <StatisticsTable statistics={statistics} settings={settings} />
                <h1>Export</h1>
                <a
                    href={
                        "data:text/plain;charset=utf-8," +
                        encodeURIComponent(window.localStorage.getItem("foodlog") || "error")
                    }
                    download={dateToString(new Date()) + "-foodlog-export.json"}
                >
                    Download all data as JSON
                </a>
            </div>
        </>
    );
}
