import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { Consumption, emptyConsumption, consumptionsByDate } from "../Data";
import { dateToString } from "../../Utilities";
import ConsumptionsTable from "./ConsumptionsTable";
import { AppStateContext } from "../../AppState/Context";
import { createAction, updateAction, deleteAction, undoDeleteAction } from "../Actions";

interface ConsumptionsUrlParams {
    date: string;
}
type ConsumptionsPageProps = RouteComponentProps<ConsumptionsUrlParams>;

export default function ConsumptionsPage(props: ConsumptionsPageProps): React.ReactElement {
    const [appState, reducer] = useContext(AppStateContext);
    const date = new Date(props.match.params.date || new Date().valueOf());
    const [consumptions, setConsumptions] = useState<Consumption[]>([]);
    const datePickerRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<Instance>();

    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    useEffect(() => {
        setConsumptions(consumptionsByDate(appState, date));
        flatpickrInstance.current = flatpickr(datePickerRef.current as Node, {
            defaultDate: date,
            // Need to use any because "below center" was added to flatpickr but they
            // did not update their types.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            position: "below center" as any,
            disableMobile: true,
            onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
                if (appState.datesWithConsumptions.has(dateToString(dayElem.dateObj))) {
                    dayElem.innerHTML += "<span class='flatpickr-day-with-data-marker'></span>";
                }
            },
            onChange: (_selected, dateStr) => {
                props.history.push("/log/" + dateStr);
            },
        });
    }, [dateToString(date), appState]);

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
                consumptions={consumptions}
                consumables={[...Object.values(appState.foods), ...Object.values(appState.recipes)]}
                settings={appState.settings}
                emptyItem={emptyConsumption(date)}
                onCreate={(item) => reducer(createAction(item))}
                onUpdate={(item) => reducer(updateAction(item))}
                onDelete={(item) => reducer(deleteAction(item))}
                onUndoDelete={(item) => reducer(undoDeleteAction(item))}
            />
        </>
    );
}
