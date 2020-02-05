import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavDrawerState {
    isVisible: boolean;
    toggle: () => void;
}

export const NavDrawerContext = React.createContext<NavDrawerState>({
    isVisible: false,
    toggle: () => {
        return;
    },
});

export const NavDrawerProvider: React.FunctionComponent = ({ children }): React.ReactElement => {
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    const toggle = (): void => setDrawerVisible((prev) => !prev);
    return (
        <NavDrawerContext.Provider
            value={{
                isVisible: drawerVisible,
                toggle,
            }}
        >
            {children}
        </NavDrawerContext.Provider>
    );
};

interface NavItemProps {
    to: string;
    children: string;
    isActive?: (url: string) => boolean;
}

function NavItem(props: NavItemProps): React.ReactElement {
    const location = useLocation();
    const ctx = React.useContext(NavDrawerContext);
    const url = location.pathname;
    const isActive = props.isActive ? props.isActive(url) : url === props.to;

    return (
        <li className={"nav-drawer__item" + (isActive ? " nav-drawer__item--active" : "")}>
            <Link className="nav-drawer__link" to={props.to} onClick={ctx.toggle}>
                {props.children}
            </Link>
        </li>
    );
}

export function NavDrawer(): React.ReactElement {
    const ctx = React.useContext(NavDrawerContext);
    return (
        <>
            <nav className={"nav-drawer " + (ctx.isVisible ? " nav-drawer--visible" : "")}>
                <Link className="nav-drawer__title" to="/" onClick={ctx.toggle}>
                    FoodLog
                </Link>
                <hr className="nav-drawer__divider" />
                <ul className="nav-drawer__list">
                    <NavItem to="/" isActive={(url) => url.substr(0, 5) === "/log/" || url === "/"}>
                        Log
                    </NavItem>
                    <NavItem to="/foods" isActive={(url) => url.substr(0, 6) === "/foods"}>
                        Foods
                    </NavItem>
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
