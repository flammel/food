import React from "react";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

interface NavItemProps extends RouteComponentProps {
    to: string;
    children: string;
    isActive?: (url: string) => boolean;
}

function NavItem(props: NavItemProps): React.ReactElement {
    const url = props.location.pathname;
    const isActive = props.isActive ? props.isActive(url) : url === props.to;
    const className = isActive ? "active" : "";

    return (
        <li className={"nav-item " + className}>
            <Link className="nav-link" to={props.to}>
                {props.children}
            </Link>
        </li>
    );
}

export default withRouter(NavItem);
