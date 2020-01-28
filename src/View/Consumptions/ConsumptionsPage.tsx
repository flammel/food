import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { Consumption, nutritionData } from "../../Domain/Consumption";
import { dateToString } from "../../Utilities";
import { Settings, emptySettings } from "../../Domain/Settings";
import DateNavigation from "./DateNavigation";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { MenuButton } from "../TopBar/TopBar";

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

    useEffect(() => {
        const fetchConsumptions = async () => {
            const result = await api.consumptions.load(date);
            setConsumptions(result);
        };
        fetchConsumptions();
    }, [dateToString(date)]);

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await api.settings.load();
            setSettings(result);
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchDatesWithConsumptions = async () => {
            const result = await api.consumptions.loadDatesWithData();
            setDatesWithConsumptions(result);
        };
        fetchDatesWithConsumptions();
    }, []);

    const caloriesSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).calories, 0);
    const carbsSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).carbs, 0);
    const fatSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).fat, 0);
    const proteinSum = consumptions.reduce((acc, cur) => acc + nutritionData(cur).protein, 0);

    return (
        <>
            <TopBar>
                <MenuButton />
                Log
            </TopBar>
            <DateNavigation
                date={date}
                onChange={(dateStr: string) => props.history.push("/log/" + dateStr)}
                datesWithConsumptions={datesWithConsumptions}
            />
            <div className="consumption consumption--totals consumption--only-macros">
                <div className="consumption__macros">
                    <div className="consumption__macro" data-label="Calories" data-suffix={"/" + settings.targetCalories}>
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
                    <Link to={"/log/" + dateToString(date) + "/" + consumption.id} className="consumption" key={consumption.id}>
                        <div className="consumption__consumable">{Formatter.consumable(consumption.consumable)}</div>
                        <div className="consumption__quantity">{Formatter.quantity(consumption.quantity)}</div>
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
                <svg className="fab__icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path></svg>
            </Link>
        </>
    );
}
