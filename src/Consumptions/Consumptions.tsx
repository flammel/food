import React, { useState, useEffect, useRef } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import flatpickr from "flatpickr";
import { Consumption } from "./Data";
import { emptyFood } from "../Foods/Data";
import { dateToString } from "../Utilities";
import ConsumptionsTable from "./ConsumptionsTable";
import Repository from "./ConsumptionsRepository";
import FoodsRepository from "../Foods/FoodsRepository";
import RecipesRepository from "../Recipes/RecipesRepository";
import { Instance } from "flatpickr/dist/types/instance";

interface ConsumptionsUrlParams {
    date: string;
}

type ConsumptionsPageProps = RouteComponentProps<ConsumptionsUrlParams>;

export default function ConsumptionsPage(props: ConsumptionsPageProps): React.ReactElement {
    const date = new Date(props.match.params.date || new Date().valueOf());
    const [consumptions, setConsumptions] = useState<Consumption[]>([]);
    const datePickerRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<Instance>();

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

    const repoAction = (action: (c: Consumption) => void): ((c: Consumption) => void) => {
        return (consumption) => {
            action(consumption);
            setConsumptions(Repository.load(date));
        };
    };

    useEffect(() => {
        setConsumptions(Repository.load(date));
        const datesWithData = Repository.datesWithData();
        flatpickrInstance.current = flatpickr(
            datePickerRef.current as Node,
            {
                defaultDate: date,
                // Need to use any because "below center" was added to flatpickr but they
                // did not update their types.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                position: "below center" as any,
                disableMobile: true,
                onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
                    if (datesWithData.has(dateToString(dayElem.dateObj))) {
                        dayElem.innerHTML += "<span class='flatpickr-day-with-data-marker'></span>";
                    }
                },
                onChange: (_selected, dateStr) => {
                    props.history.push("/log/" + dateStr);
                }
            }
        );
    }, [dateToString(date)]);

    return (
        <>
            <div className="consumptions-header">
                <Link className="consumptions-header__nav-link" to={"/log/" + dateToString(previousDay)}>
                    prev
                </Link>
                <input type="text" className="consumptions-header__date-input" ref={datePickerRef} />
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
