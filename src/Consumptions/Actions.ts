import { uuidv4 } from "../UUID";
import { Action, AppState } from "../AppState/Types";
import { Consumption } from "./Data";

export function createAction(consumption: Consumption): Action {
    return (prev: AppState) => {
        const id = uuidv4();
        return {
            ...prev,
            consumptions: { ...prev.consumptions, [id]: { ...consumption, id, sort: new Date().valueOf() } },
        };
    };
}

export function updateAction(consumption: Consumption): Action {
    return (prev: AppState) => {
        return { ...prev, consumptions: { ...prev.consumptions, [consumption.id]: consumption } };
    };
}

export function deleteAction(consumption: Consumption): Action {
    return (prev: AppState) => {
        return {
            ...prev,
            consumptions: { ...prev.consumptions, [consumption.id]: { ...consumption, isDeleted: true } },
        };
    };
}

export function undoDeleteAction(consumption: Consumption): Action {
    return (prev: AppState) => {
        return {
            ...prev,
            consumptions: { ...prev.consumptions, [consumption.id]: { ...consumption, isDeleted: false } },
        };
    };
}
