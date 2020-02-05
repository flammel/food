import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useRouteMatch, useParams, useHistory } from "react-router-dom";
import flatpickr from "flatpickr";
import { Consumption, nutritionData, emptyConsumption } from "../../Domain/Consumption";
import { dateToString } from "../../Utilities";
import { Settings, emptySettings } from "../../Domain/Settings";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { MenuButton, Title } from "../TopBar/TopBar";
import { Instance } from "flatpickr/dist/types/instance";
import FloatingActionButton from "../FloatingActionButton";
import { IconChevronLeft, IconChevronRight } from "../Icons";
import ConsumptionForm from "./ConsumptionsForm";
import { nilUUID } from "../../Domain/UUID";

export default function ConsumptionsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const params = useParams<{ date: string }>();
    const addMatch = useRouteMatch("/log/:date/add");
    const editMatch = useRouteMatch<{ id: string }>("/log/:date/edit/:id");
    const history = useHistory();
    const [date, setDate] = useState<Date>(new Date());
    const [consumptions, setConsumptions] = useState<Consumption[]>([]);
    const [consumption, setConsumption] = useState<Consumption>(emptyConsumption(date));
    const [settings, setSettings] = useState<Settings>(emptySettings);
    const [datesWithConsumptions, setDatesWithConsumptions] = useState<Set<string>>(new Set());
    const datePickerRef = useRef<HTMLButtonElement>(null);
    const flatpickrInstance = useRef<Instance>();

    const fetchConsumptions = async (): Promise<void> => {
        const result = await api.consumptions.load(date);
        setConsumptions(result);
    };
    useEffect(() => {
        fetchConsumptions();
        setConsumption(emptyConsumption(date));
    }, [dateToString(date)]);

    useEffect(() => setDate(new Date(params.date || new Date())), [params.date]);

    useEffect(() => {
        const editingId = editMatch?.params.id;
        if (editingId) {
            const fetchFn = async (): Promise<void> => {
                const loaded = await api.consumptions.read(editingId);
                if (loaded) {
                    setConsumption(loaded);
                }
            };
            fetchFn();
        } else {
            setConsumption(emptyConsumption(date));
        }
    }, [editMatch?.params.id]);

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
                history.push("/log/" + dateStr);
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
            <div className="main">
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
                <div className="card card--totals card--only-macros">
                    <div className="card__macros">
                        <div className="card__macro" data-label="Calories" data-suffix={"/" + settings.targetCalories}>
                            {Formatter.calories(caloriesSum)}
                        </div>
                        <div className="card__macro" data-label="Carbs" data-suffix={"/" + settings.targetCarbs}>
                            {Formatter.macro(carbsSum)}
                        </div>
                        <div className="card__macro" data-label="Fat" data-suffix={"/" + settings.targetFat}>
                            {Formatter.macro(fatSum)}
                        </div>
                        <div className="card__macro" data-label="Protein" data-suffix={"/" + settings.targetProtein}>
                            {Formatter.macro(proteinSum)}
                        </div>
                    </div>
                </div>
                <div className="cards consumptions">
                    <div className="card card--header">
                        <div className="card__name">Food or Recipe</div>
                        <div className="card__servings">Quantity</div>
                        <div className="card__macros">
                            <div className="card__macro">Calories</div>
                            <div className="card__macro">Carbs</div>
                            <div className="card__macro">Fat</div>
                            <div className="card__macro">Protein</div>
                        </div>
                    </div>
                    {consumptions.length === 0 ? (
                        <p className="no-items">
                            No consumptions for this date.{" "}
                            <Link to={"/log/" + dateToString(date) + "/add"}>Create one?</Link>
                        </p>
                    ) : null}
                    {consumptions.map((consumption) => {
                        const values = nutritionData(consumption);
                        return (
                            <Link
                                to={"/log/" + dateToString(date) + "/edit/" + consumption.id}
                                className={
                                    "consumption card " +
                                    (editMatch && editMatch.params.id !== consumption.id ? " card--inactive" : "") +
                                    (editMatch && editMatch.params.id === consumption.id ? " card--active" : "")
                                }
                                key={consumption.id}
                            >
                                <div className="card__consumable">{Formatter.consumable(consumption.consumable)}</div>
                                <div className="card__quantity">
                                    {Formatter.quantity(consumption.quantity)}
                                    &nbsp;
                                    {Formatter.consumableUnit(consumption.consumable, consumption.quantity)}
                                </div>
                                <div className="card__macros">
                                    <div className="card__macro" data-label="Calories">
                                        {Formatter.calories(values.calories)}
                                    </div>
                                    <div className="card__macro" data-label="Carbs">
                                        {Formatter.macro(values.carbs)}
                                    </div>
                                    <div className="card__macro" data-label="Fat">
                                        {Formatter.macro(values.fat)}
                                    </div>
                                    <div className="card__macro" data-label="Protein">
                                        {Formatter.macro(values.protein)}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <FloatingActionButton target={"/log/" + dateToString(date) + "/add"} />
            </div>
            <div className={"side " + (editMatch || addMatch ? " side--visible" : "")}>
                <ConsumptionForm
                    date={date}
                    consumption={consumption}
                    editing={consumption.id !== nilUUID}
                    reload={fetchConsumptions}
                />
            </div>
        </>
    );
}
