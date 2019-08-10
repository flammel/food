import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Consumption } from "./Data";
import { emptyFood } from "../Foods/Data";
import { dateToString } from "../Utilities";
import ConsumptionsTable from "./ConsumptionsTable";
import Repository from "./ConsumptionsRepository";
import FoodsRepository from "../Foods/FoodsRepository";
import RecipesRepository from "../Recipes/RecipesRepository";

interface ConsumptionsUrlParams {
    date: string;
}

interface ConsumptionsPageProps extends RouteComponentProps<ConsumptionsUrlParams> {}

export default function ConsumptionsPage(props: ConsumptionsPageProps) {
    const date = new Date(props.match.params.date || new Date().valueOf());
    const [consumptions, setConsumptions] = useState([]);

    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const emptyConsumption: Consumption = {
        id: 0,
        date: date,
        consumable: emptyFood,
        quantity: 100,
        isDeleted: false,
    };

    const repoAction = (action: (consumption: Consumption) => void) => {
        return (consumption: Consumption) => {
            action(consumption);
            setConsumptions(Repository.load(date));
        };
    };

    useEffect(() => {
        setConsumptions(Repository.load(date));
    }, [dateToString(date)]);

    return (
        <>
            <div className="consumptions-header">
                <Link className="consumptions-header__nav-link" to={"/log/" + dateToString(previousDay)}>
                    prev
                </Link>
                <h1 className="consumptions-header__current-date">{dateToString(date)}</h1>
                <Link className="consumptions-header__nav-link" to={"/log/" + dateToString(nextDay)}>
                    next
                </Link>
            </div>
            <ConsumptionsTable
                emptyItem={emptyConsumption}
                consumptions={consumptions}
                consumables={[...FoodsRepository.load(), ...RecipesRepository.load()]}
                onCreate={repoAction(Repository.create)}
                onUpdate={repoAction(Repository.update)}
                onDelete={repoAction(Repository.delete)}
                onUndoDelete={repoAction(Repository.undoDelete)}
            />
        </>
    );
}
