import React from "react";

interface IconProps {
    className: string;
}

export const IconChevronLeft = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 8 16" version="1.1">
        <path fillRule="evenodd" d="M5.5 3L7 4.5 3.25 8 7 11.5 5.5 13l-5-5 5-5z"></path>
    </svg>
);

export const IconChevronRight = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 8 16" version="1.1">
        <path fillRule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z"></path>
    </svg>
);

export const IconCalendar = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 14 16" version="1.1" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z"
        ></path>
    </svg>
);

export const IconArrowLeft = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
    </svg>
);

export const IconHamburger = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 12 16" version="1.1" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"
        ></path>
    </svg>
);

export const IconTrash = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 12 16" version="1.1" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"
        ></path>
    </svg>
);

export const IconPlus = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 12 16" version="1.1" aria-hidden="true">
        <path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path>
    </svg>
);

export const IconCircledPlus = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
    </svg>
);

export const IconCircledMinus = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
    </svg>
);

export const IconChevronDown = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 10 16" version="1.1" aria-hidden="true">
        <path fillRule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path>
    </svg>
);

export const IconX = (props: IconProps): React.ReactElement => (
    <svg className={props.className} viewBox="0 0 12 16" version="1.1" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
        ></path>
    </svg>
);
