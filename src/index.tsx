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
import { AppStateProvider } from "./AppState/Context";
import "./index.scss";

ReactDOM.render(
    <Router>
        <Nav />
        <div className="container-fluid mb-3">
            <Route
                path="/"
                exact
                render={(props) => (
                    <AppStateProvider>
                        <Consumptions {...props} />
                    </AppStateProvider>
                )}
            />
            <Route
                path="/settings"
                render={() => (
                    <AppStateProvider>
                        <Settings />
                    </AppStateProvider>
                )}
            />
            <Route
                path="/about"
                render={() => (
                    <AppStateProvider>
                        <About />
                    </AppStateProvider>
                )}
            />
            <Route
                path="/foods"
                render={() => (
                    <AppStateProvider>
                        <Foods />
                    </AppStateProvider>
                )}
            />
            <Route
                path="/recipes"
                exact
                render={(props) => (
                    <AppStateProvider>
                        <Recipes {...props} />
                    </AppStateProvider>
                )}
            />
            <Switch>
                <Route
                    path="/recipes/new"
                    render={(props) => (
                        <AppStateProvider>
                            <RecipeForm {...props} />
                        </AppStateProvider>
                    )}
                />
                <Route
                    path="/recipes/:id"
                    render={(props) => (
                        <AppStateProvider>
                            <RecipeForm {...props} />
                        </AppStateProvider>
                    )}
                />
            </Switch>
            <Route
                path="/log/:date"
                render={(props) => (
                    <AppStateProvider>
                        <Consumptions {...props} />
                    </AppStateProvider>
                )}
            />
        </div>
    </Router>,
    document.getElementById("app"),
);
