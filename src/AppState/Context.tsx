import React, { useState, FunctionComponent, useEffect } from "react";
import { AppState, Action } from "./Types";
import { loadAppState, storeAppState } from "./Storage";

export const initialAppState: AppState = {
    consumptions: {},
    datesWithConsumptions: new Set(),
    foods: {},
    recipes: {},
    settings: {
        targetCalories: 0,
        targetFat: 0,
        targetCarbs: 0,
        targetProtein: 0,
    },
};

type Reducer = (fn: Action) => Promise<void>;
const initialReducer: Reducer = (): Promise<void> => new Promise((resolve) => resolve());

export const AppStateContext = React.createContext<[AppState, Reducer]>([initialAppState, initialReducer]);

export const AppStateProvider: FunctionComponent = ({ children }): React.ReactElement => {
    const [appState, setAppState] = useState<AppState>(initialAppState);
    const reducer = (fn: Action): Promise<void> => {
        const newState = fn(appState);
        return storeAppState(newState).then(setAppState).catch(err => console.error(err));
    };
    useEffect(() => {
        loadAppState()
            .then((appState) => setAppState(appState))
            .catch((err) => console.error("Loading app state failed", err));
    }, []);
    return <AppStateContext.Provider value={[appState, reducer]}>{children}</AppStateContext.Provider>;
};
