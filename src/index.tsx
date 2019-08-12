import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./Nav/Nav";
import Foods from "./Foods/Foods";
import Consumptions from "./Consumptions/Consumptions";
import Recipes from "./Recipes/Recipes";
import RecipeForm from "./Recipes/RecipeForm";
import Settings from "./Settings/Settings";
import About from "./About";
import "./index.scss";

ReactDOM.render(
    <Router>
        <Nav />
        <div className="container-fluid mb-3">
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
