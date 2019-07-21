import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavItem from "./Nav/NavItem";
import Foods from "./Foods/Foods";
import Consumptions from "./Consumptions/Consumptions";
import Recipes from "./Recipes/Recipes";
import "./index.scss";

ReactDOM.render(
    <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <Link className="navbar-brand" to="/">
                Food
            </Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <NavItem to="/">Log</NavItem>
                    <NavItem to="/foods/">Foods</NavItem>
                    <NavItem to="/recipes/">Recipes</NavItem>
                </ul>
            </div>
        </nav>
        <div className="container-fluid">
            <Route path="/" exact component={Consumptions} />
            <Route path="/foods/" component={Foods} />
            <Route path="/recipes/" component={Recipes} />
            <Route path="/log/:date" component={Consumptions} />
        </div>
    </Router>,
    document.getElementById("app"),
);
