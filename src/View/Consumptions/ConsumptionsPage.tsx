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
import FloatingActionButton from "../FloatingActionButton";
import { IconChevronLeft, IconChevronRight } from "../Icons";

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
        return flatpickrInstance.current?.destroy;
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
                <Title>
                    <span ref={datePickerRef}>{dateToString(date)}</span>
                </Title>
                <Link className="top-bar__action-button" to={"/log/" + dateToString(previousDay)}>
                    <IconChevronLeft className="top-bar__action-icon" />
                </Link>
                <Link className="top-bar__action-button" to={"/log/" + dateToString(nextDay)}>
                    <IconChevronRight className="top-bar__action-icon" />
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
            <div className="consumptions">
            {consumptions.length === 0 ? (
                <p className="no-items">
                    No consumptions for this date. <Link to={"/log/" + dateToString(date) + "/add"}>Create one?</Link>
                </p>
            ) : null}
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
            </div>
            <FloatingActionButton target={"/log/" + dateToString(date) + "/add"} />
        </>
    );
}
