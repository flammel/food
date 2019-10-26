import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { dateToString } from "../../Utilities";

interface Props {
    date: Date;
    onChange: (dateStr: string) => void;
    datesWithConsumptions: Set<string>;
}

export default function DateNavigation(props: Props): React.ReactElement {
    const datePickerRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<Instance>();

    const previousDay = new Date(props.date);
    previousDay.setDate(previousDay.getDate() - 1);
    const nextDay = new Date(props.date);
    nextDay.setDate(nextDay.getDate() + 1);

    useEffect(() => {
        flatpickrInstance.current = flatpickr(datePickerRef.current as Node, {
            defaultDate: props.date,
            // Need to use any because "below center" was added to flatpickr but they
            // did not update their types.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            position: "below center" as any,
            disableMobile: true,
            onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
                if (props.datesWithConsumptions.has(dateToString(dayElem.dateObj))) {
                    dayElem.innerHTML += "<span class='flatpickr-day-with-data-marker'></span>";
                }
            },
            onChange: (_selected, dateStr) => {
                props.onChange(dateStr);
            },
        });
    }, [dateToString(props.date), props.datesWithConsumptions]);

    return (
        <div className="consumptions-header">
            <Link className="consumptions-header__nav-link" to={"/log/" + dateToString(previousDay)}>
                prev
            </Link>
            <input type="text" className="consumptions-header__date-input" ref={datePickerRef} />
            <Link className="consumptions-header__nav-link" to={"/log/" + dateToString(nextDay)}>
                next
            </Link>
        </div>
    );
}
