import * as React from "react";
import { Link } from "react-router-dom";
import NavItem from "./NavItem";

export default function Nav(): React.ReactElement {
    const [show, setShow] = React.useState(false);
    const onToggle = (): void => {
        setShow((prev) => !prev);
    };
    return (
        <nav className="navbar navbar-expand-md navbar-light bg-light mb-3">
            <Link className="navbar-brand" to="/">
                FoodLog
            </Link>
            <button className="navbar-toggler" type="button" onClick={onToggle}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={"collapse navbar-collapse" + (show ? " show" : "")} onClick={onToggle}>
                <ul className="navbar-nav flex-grow-1">
                    <NavItem to="/" isActive={(url) => url.substr(0, 5) === "/log/" || url === "/"}>
                        Log
                    </NavItem>
                    <NavItem to="/foods">Foods</NavItem>
                    <NavItem to="/recipes" isActive={(url) => url.substr(0, 8) === "/recipes"}>
                        Recipes
                    </NavItem>
                </ul>
                <ul className="navbar-nav">
                    <NavItem to="/settings">Settings</NavItem>
                    <NavItem to="/about">About</NavItem>
                </ul>
            </div>
        </nav>
    );
}
