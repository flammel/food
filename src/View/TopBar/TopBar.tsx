import * as React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

type Action = "delete";

interface Props {
    children: Array<React.ReactChild | null> | React.ReactChild;
}

interface NavDrawerState {
    isVisible: boolean;
    toggle: () => void;
}

const NavDrawerContext = React.createContext<NavDrawerState>({ isVisible: false, toggle: () => {} });

export default function TopBar(props: Props): React.ReactElement {
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    return (
        <NavDrawerContext.Provider
            value={{
                isVisible: drawerVisible,
                toggle: () => {
                    setDrawerVisible((prev) => !prev);
                },
            }}
        >
            <div className="top-bar">{props.children}</div>
            <NavDrawer />
        </NavDrawerContext.Provider>
    );
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

interface NavItemProps extends RouteComponentProps {
    to: string;
    children: string;
    isActive?: (url: string) => boolean;
}

const NavItem = withRouter(
    (props: NavItemProps): React.ReactElement => {
        const url = props.location.pathname;
        const isActive = props.isActive ? props.isActive(url) : url === props.to;

        return (
            <li className={"nav-drawer__item" + (isActive ? " nav-drawer__item--active" : "")}>
                <Link className="nav-drawer__link" to={props.to}>
                    {props.children}
                </Link>
            </li>
        );
    },
);

function NavDrawer(): React.ReactElement {
    const ctx = React.useContext(NavDrawerContext);
    return (
        <>
            <nav className={"nav-drawer " + (ctx.isVisible ? " nav-drawer--visible" : "")}>
                <Link className="nav-drawer__title" to="/">
                    FoodLog
                </Link>
                <hr className="nav-drawer__divider" />
                <ul className="nav-drawer__list">
                    <NavItem to="/" isActive={(url) => url.substr(0, 5) === "/log/" || url === "/"}>
                        Log
                    </NavItem>
                    <NavItem to="/foods">Foods</NavItem>
                    <NavItem to="/recipes" isActive={(url) => url.substr(0, 8) === "/recipes"}>
                        Recipes
                    </NavItem>
                </ul>
                <hr className="nav-drawer__divider" />
                <ul className="nav-drawer__list">
                    <NavItem to="/statistics">Statistics</NavItem>
                    <NavItem to="/settings">Settings</NavItem>
                    <NavItem to="/about">About</NavItem>
                </ul>
            </nav>
            <div className={"scrim " + (ctx.isVisible ? " scrim--visible" : "")} onClick={ctx.toggle}></div>
        </>
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

export const BackButton = withRouter(
    (props: RouteComponentProps): React.ReactElement => {
        return (
            <button
                className="top-bar__nav-button"
                onClick={() => {
                    props.history.goBack();
                }}
            >
                <svg className="top-bar__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                </svg>
            </button>
        );
    },
);

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
