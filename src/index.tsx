import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Foods from "./View/Foods/FoodsPage";
import FoodsForm from "./View/Foods/FoodFormPage";
import Consumptions from "./View/Consumptions/ConsumptionsPage";
import ConsumptionsForm from "./View/Consumptions/ConsumptionsFormPage";
import Recipes from "./View/Recipes/RecipesPage";
import RecipeForm from "./View/Recipes/RecipeFormPage";
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
                    <Route path="/" exact component={Consumptions} />
                    <Route path="/statistics" component={Statistics} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/about" component={About} />
                    <Route path="/foods" exact component={Foods} />
                    <Switch>
                        <Route path="/foods/add" component={FoodsForm} />
                        <Route path="/foods/:id" component={FoodsForm} />
                    </Switch>
                    <Route path="/recipes" exact component={Recipes} />
                    <Switch>
                        <Route path="/recipes/add" component={RecipeForm} />
                        <Route path="/recipes/:id" component={RecipeForm} />
                    </Switch>
                    <Switch>
                        <Route path="/log/:date/add" component={ConsumptionsForm} />
                        <Route path="/log/:date/:id" component={ConsumptionsForm} />
                        <Route path="/log/:date" component={Consumptions} />
                    </Switch>
                    <NavDrawer />
                    <SnackbarContainer />
                </ApiProvider>
            </SnackbarProvider>
        </NavDrawerProvider>
    </Router>,
    document.getElementById("app"),
);
