import React from "react";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

interface NavItemProps extends RouteComponentProps {
    to: string;
    children: string;
}

function NavItem(props: NavItemProps) {
    var isActive = props.location.pathname === props.to;
    var className = isActive ? "active" : "";

    return (
        <li className={"nav-item " + className}>
            <Link className="nav-link" to={props.to}>
                {props.children}
            </Link>
        </li>
    );
}

export default withRouter(NavItem);
