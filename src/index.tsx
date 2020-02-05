import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Foods from "./View/Foods/FoodsPage";
import Consumptions from "./View/Consumptions/ConsumptionsPage";
import Recipes from "./View/Recipes/RecipesPage";
import Settings from "./View/Settings/SettingsPage";
import About from "./View/About";
import Statistics from "./View/Statistics/StatisticsPage";
import { ApiProvider } from "./Api/Context";
import "./index.scss";
import { NavDrawerProvider, NavDrawer } from "./View/Nav";
import { SnackbarProvider, SnackbarContainer } from "./View/Snackbar";

ReactDOM.render(
    <Router>
        <NavDrawerProvider>
            <SnackbarProvider>
                <ApiProvider>
                    <NavDrawer />
                    <Route path="/" exact component={Consumptions} />
                    <Route path="/statistics" component={Statistics} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/about" component={About} />
                    <Route path="/foods" component={Foods} />
                    <Route path="/recipes" component={Recipes} />
                    <Route path="/log/:date" component={Consumptions} />
                    <SnackbarContainer />
                </ApiProvider>
            </SnackbarProvider>
        </NavDrawerProvider>
    </Router>,
    document.getElementById("app"),
);
