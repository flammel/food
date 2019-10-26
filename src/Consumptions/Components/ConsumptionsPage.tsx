import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import Fuse from "fuse.js";
import { Consumption, emptyConsumption } from "../Data";
import { dateToString } from "../../Utilities";
import ConsumptionsTable from "./ConsumptionsTable";
import { Settings, emptySettings } from "../../Settings/Data";
import DateNavigation from "./DateNavigation";
import { ApiContext } from "../../Api/Context";
import { Consumable } from "../../Consumable";

interface ConsumptionsUrlParams {
    date: string;
}
type ConsumptionsPageProps = RouteComponentProps<ConsumptionsUrlParams>;

export default function ConsumptionsPage(props: ConsumptionsPageProps): React.ReactElement {
    const api = useContext(ApiContext);
    const date = new Date(props.match.params.date || new Date().valueOf());
    const [consumptions, setConsumptions] = useState<Consumption[]>([]);
    const [settings, setSettings] = useState<Settings>(emptySettings);
    const [datesWithConsumptions, setDatesWithConsumptions] = useState<Set<string>>(new Set());

    const fetchConsumptions = async () => {
        const result = await api.consumptions.load(date);
        setConsumptions(result);
    };

    useEffect(() => {
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

    const consumableSearch = async (search: string): Promise<Consumable[]> => {
        const consumables = await api.consumables.autocomplete(search);
        const fuse = new Fuse(consumables, {
            keys: ["name", "brand"],
        });
        const result = fuse.search(search);
        return result;
    };

    return (
        <>
            <DateNavigation
                date={date}
                onChange={(dateStr: string) => props.history.push("/log/" + dateStr)}
                datesWithConsumptions={datesWithConsumptions}
            />
            <ConsumptionsTable
                consumptions={consumptions}
                settings={settings}
                emptyItem={emptyConsumption(date)}
                onCreate={(item) => api.consumptions.create(item).then(fetchConsumptions)}
                onUpdate={(item) => api.consumptions.update(item).then(fetchConsumptions)}
                onDelete={(item) => api.consumptions.delete(item).then(fetchConsumptions)}
                onUndoDelete={(item) => api.consumptions.undoDelete(item).then(fetchConsumptions)}
                consumableSearch={consumableSearch}
            />
        </>
    );
}
