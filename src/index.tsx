import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./Nav/Nav";
import Foods from "./Foods/Components/FoodsPage";
import Consumptions from "./Consumptions/Components/ConsumptionsPage";
import Recipes from "./Recipes/Components/RecipesPage";
import RecipeForm from "./Recipes/Components/RecipeFormPage";
import Settings from "./Settings/Components/SettingsPage";
import About from "./About";
import "./index.scss";
import StatisticsPage from "./Statistics/Components/StatisticsPage";
import { ApiProvider } from "./Api/Context";

ReactDOM.render(
    <Router>
        <Nav />
        <div className="container-fluid mb-3">
            <ApiProvider>
                <Route path="/" exact component={Consumptions} />
                <Route path="/statistics" component={StatisticsPage} />
                <Route path="/settings" component={Settings} />
                <Route path="/about" component={About} />
                <Route path="/foods" component={Foods} />
                <Route path="/recipes" exact component={Recipes} />
                <Switch>
                    <Route path="/recipes/new" component={RecipeForm} />
                    <Route path="/recipes/:id" component={RecipeForm} />
                </Switch>
                <Route path="/log/:date" component={Consumptions} />
            </ApiProvider>
        </div>
    </Router>,
    document.getElementById("app"),
);
