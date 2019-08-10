import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NavItem from "./Nav/NavItem";
import Foods from "./Foods/Foods";
import Consumptions from "./Consumptions/Consumptions";
import Recipes from "./Recipes/Recipes";
import RecipeForm from "./Recipes/RecipeForm";
import "./index.scss";
import Settings from "./Settings/Settings";
import About from "./About";

ReactDOM.render(
    <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <Link className="navbar-brand" to="/">
                Food
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav main-nav">
                    <NavItem to="/">Log</NavItem>
                    <NavItem to="/foods">Foods</NavItem>
                    <NavItem to="/recipes">Recipes</NavItem>
                </ul>
                <ul className="navbar-nav">
                    <NavItem to="/settings">Settings</NavItem>
                    <NavItem to="/about">About</NavItem>
                </ul>
            </div>
        </nav>
        <div className="container-fluid">
            <Route path="/" exact component={Consumptions} />
            <Route path="/settings" component={Settings} />
            <Route path="/about" component={About} />
            <Route path="/foods" component={Foods} />
            <Route path="/recipes" exact component={Recipes} />
            <Switch>
                <Route path="/recipes/new" component={RecipeForm} />
                <Route path="/recipes/:id" component={RecipeForm} />
            </Switch>
            <Route path="/log/:date" component={Consumptions} />
        </div>
    </Router>,
    document.getElementById("app"),
);
