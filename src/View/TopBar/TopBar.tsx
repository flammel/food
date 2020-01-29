import * as React from "react";
import { useHistory } from "react-router-dom";
import { NavDrawerContext } from "../Nav";

type Action = "delete";

interface Props {
    children: Array<React.ReactChild | null> | React.ReactChild;
}

export default function TopBar(props: Props): React.ReactElement {
    return <div className="top-bar">{props.children}</div>;
}

export function Title(props: { children: React.ReactChild[] | React.ReactChild }): React.ReactElement {
    return <span className="top-bar__title">{props.children}</span>;
}

interface SearchProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export function Search(props: SearchProps): React.ReactElement {
    return (
        <input
            className="top-bar__search"
            type="text"
            placeholder={props.placeholder}
            onChange={(e) => props.onChange(e.target.value)}
            value={props.value}
        />
    );
}

export function MenuButton(): React.ReactElement {
    const ctx = React.useContext(NavDrawerContext);
    return (
        <button className="top-bar__nav-button" onClick={ctx.toggle}>
            <svg className="top-bar__nav-icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
                <path
                    fillRule="evenodd"
                    d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"
                ></path>
            </svg>
        </button>
    );
}

export function BackButton(): React.ReactElement {
    const history = useHistory();
    return (
        <button
            className="top-bar__nav-button"
            onClick={() => {
                history.goBack();
            }}
        >
            <svg className="top-bar__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
            </svg>
        </button>
    );
}

export function Action(props: { icon: "delete"; action: () => void }): React.ReactElement {
    return (
        <button className="top-bar__action-button" onClick={props.action}>
            <svg className="top-bar__action-icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
                <path
                    fillRule="evenodd"
                    d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"
                ></path>
            </svg>
        </button>
    );
}
