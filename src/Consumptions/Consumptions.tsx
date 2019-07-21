import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import ConsumptionsTable from "./ConsumptionsTable";
import { loadConsumptions, Consumption, saveConsumption, dateToString } from "./Data";
import { loadFoods } from "../Foods/Data";

interface ConsumptionsUrlParams {
    date: string
}

interface ConsumptionsProps extends RouteComponentProps<ConsumptionsUrlParams> {
}

export default function Consumptions(props: ConsumptionsProps) {
    const date = new Date(props.match.params.date || (new Date()).valueOf());
    const [consumptions, setConsumptions] = useState([]);
    useEffect(() => {
        setConsumptions(loadConsumptions(date))
    }, [dateToString(date)]);
    const onSave = (consumption: Consumption) => {
        saveConsumption({...consumption, date});
        setConsumptions(loadConsumptions(date));
    };
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return (
        <>
            <Link to={"/log/" + dateToString(previousDay)}>prev</Link>
            <h1>{dateToString(date)}</h1>
            <Link to={"/log/" + dateToString(nextDay)}>next</Link>
            <ConsumptionsTable consumptions={consumptions} foods={loadFoods()} onSave={onSave} />
        </>
    );
}
