import * as React from "react";
import { useHistory } from "react-router-dom";
import { NavDrawerContext } from "../Nav";
import { IconHamburger, IconArrowLeft, IconTrash } from "../Icons";

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
            <IconHamburger className="top-bar__nav-icon" />
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
            <IconArrowLeft className="top-bar__nav-icon" />
        </button>
    );
}

export function Action(props: { icon: "delete"; action: () => void }): React.ReactElement {
    return (
        <button className="top-bar__action-button" onClick={props.action}>
            <IconTrash className="top-bar__nav-icon" />
        </button>
    );
}
