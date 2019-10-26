import React, { FunctionComponent } from "react";
import { Api } from "./Interfaces";
import localStorageApi from "./Implementations/LocalStorage/Api";

export const ApiContext = React.createContext<Api>(localStorageApi);

export const ApiProvider: FunctionComponent = ({ children }): React.ReactElement => {
    return <ApiContext.Provider value={localStorageApi}>{children}</ApiContext.Provider>;
};
