import React, { useState, useEffect, useContext, useRef } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import flatpickr from "flatpickr";
import { Consumption, nutritionData } from "../../Domain/Consumption";
import { dateToString } from "../../Utilities";
import { Settings, emptySettings } from "../../Domain/Settings";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { MenuButton, Title } from "../TopBar/TopBar";
import { Instance } from "flatpickr/dist/types/instance";

interface UrlParams {
    date: string;
}
type Props = RouteComponentProps<UrlParams>;

export default function ConsumptionsPage(props: Props): React.ReactElement {
    const api = useContext(ApiContext);
    const date = new Date(props.match.params.date || new Date().valueOf());
    const [consumptions, setConsumptions] = useState<Consumption[]>([]);
    const [settings, setSettings] = useState<Settings>(emptySettings);
    const [datesWithConsumptions, setDatesWithConsumptions] = useState<Set<string>>(new Set());
    const datePickerRef = useRef<HTMLButtonElement>(null);
    const flatpickrInstance = useRef<Instance>();

    useEffect(() => {
        const fetchConsumptions = async (): Promise<void> => {
            const result = await api.consumptions.load(date);
            setConsumptions(result);
        };
        fetchConsumptions();
    }, [dateToString(date)]);

    useEffect(() => {
        const fetchSettings = async (): Promise<void> => {
            const result = await api.settings.load();
            setSettings(result);
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchDatesWithConsumptions = async (): Promise<void> => {
            const result = await api.consumptions.loadDatesWithData();
            setDatesWithConsumptions(result);
        };
        fetchDatesWithConsumptions();
    }, []);

    useEffect(() => {
        flatpickrInstance.current = flatpickr(datePickerRef.current as Node, {
            defaultDate: date,
            position: "below",
            disableMobile: true,
            onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
                if (datesWithConsumptions.has(dateToString(dayElem.dateObj))) {
                    dayElem.innerHTML += "<span class='flatpickr-day-with-data-marker'></span>";
                }
            },
            onChange: (_selected, dateStr) => {
                props.history.push("/log/" + dateStr);
            },
        });
    }, [dateToString(date), datesWithConsumptions]);

    const caloriesSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).calories, 0);
    const carbsSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).carbs, 0);
    const fatSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).fat, 0);
    const proteinSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).protein, 0);

    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    return (
        <>
            <TopBar>
                <MenuButton />
                <Title>{dateToString(date)}</Title>
                <Link className="top-bar__action-button" to={"/log/" + dateToString(previousDay)}>
                    <svg className="top-bar__action-icon" viewBox="0 0 8 16" version="1.1">
                        <path fillRule="evenodd" d="M5.5 3L7 4.5 3.25 8 7 11.5 5.5 13l-5-5 5-5z"></path>
                    </svg>
                </Link>
                <button className="top-bar__action-button" ref={datePickerRef}>
                    <svg className="top-bar__action-icon" viewBox="0 0 14 16" version="1.1" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z"
                        ></path>
                    </svg>
                </button>
                <Link className="top-bar__action-button" to={"/log/" + dateToString(nextDay)}>
                    <svg className="top-bar__action-icon" viewBox="0 0 8 16" version="1.1">
                        <path fillRule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path>
                    </svg>
                </Link>
            </TopBar>
            <div className="consumption consumption--totals consumption--only-macros">
                <div className="consumption__macros">
                    <div
                        className="consumption__macro"
                        data-label="Calories"
                        data-suffix={"/" + settings.targetCalories}
                    >
                        {Formatter.calories(caloriesSum)}
                    </div>
                    <div className="consumption__macro" data-label="Carbs" data-suffix={"/" + settings.targetCarbs}>
                        {Formatter.macro(carbsSum)}
                    </div>
                    <div className="consumption__macro" data-label="Fat" data-suffix={"/" + settings.targetFat}>
                        {Formatter.macro(fatSum)}
                    </div>
                    <div className="consumption__macro" data-label="Protein" data-suffix={"/" + settings.targetProtein}>
                        {Formatter.macro(proteinSum)}
                    </div>
                </div>
            </div>
            {consumptions.map((consumption) => {
                const values = nutritionData(consumption);
                return (
                    <Link
                        to={"/log/" + dateToString(date) + "/" + consumption.id}
                        className="consumption"
                        key={consumption.id}
                    >
                        <div className="consumption__consumable">{Formatter.consumable(consumption.consumable)}</div>
                        <div className="consumption__quantity">
                            {Formatter.quantity(consumption.quantity)}
                            &nbsp;
                            {Formatter.consumableUnit(consumption.consumable, consumption.quantity)}
                        </div>
                        <div className="consumption__macros">
                            <div className="consumption__macro" data-label="Calories">
                                {Formatter.calories(values.calories)}
                            </div>
                            <div className="consumption__macro" data-label="Carbs">
                                {Formatter.macro(values.carbs)}
                            </div>
                            <div className="consumption__macro" data-label="Fat">
                                {Formatter.macro(values.fat)}
                            </div>
                            <div className="consumption__macro" data-label="Protein">
                                {Formatter.macro(values.protein)}
                            </div>
                        </div>
                    </Link>
                );
            })}
            <Link className="fab" to={"/log/" + dateToString(date) + "/add"}>
                <svg className="fab__icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path>
                </svg>
            </Link>
        </>
    );
}
