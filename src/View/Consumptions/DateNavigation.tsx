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
        <div className="date-navigation">
            <Link className="date-navigation__nav-link date-navigation__nav-link--prev" to={"/log/" + dateToString(previousDay)}>
                <svg className="date-navigation__nav-icon" viewBox="0 0 8 16" version="1.1"><path fillRule="evenodd" d="M5.5 3L7 4.5 3.25 8 7 11.5 5.5 13l-5-5 5-5z"></path></svg>
            </Link>
            <input type="text" className="date-navigation__date-input" ref={datePickerRef} />
            <Link className="date-navigation__nav-link date-navigation__nav-link--next" to={"/log/" + dateToString(nextDay)}>
                <svg className="date-navigation__nav-icon" viewBox="0 0 8 16" version="1.1"><path fillRule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path></svg>
            </Link>
        </div>
    );
}
