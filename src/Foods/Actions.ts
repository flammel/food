import { uuidv4 } from "../UUID";
import { Action, AppState } from "../AppState/Types";
import { Food } from "./Data";

export function createAction(food: Food): Action {
    return (prev: AppState) => {
        const id = uuidv4();
        return { ...prev, foods: { ...prev.foods, [id]: { ...food, id, sort: new Date().valueOf() } } };
    };
}

export function updateAction(food: Food): Action {
    return (prev: AppState) => {
        return { ...prev, foods: { ...prev.foods, [food.id]: food } };
    };
}

export function deleteAction(food: Food): Action {
    return (prev: AppState) => {
        return { ...prev, foods: { ...prev.foods, [food.id]: { ...food, isDeleted: true } } };
    };
}

export function undoDeleteAction(food: Food): Action {
    return (prev: AppState) => {
        return { ...prev, foods: { ...prev.foods, [food.id]: { ...food, isDeleted: false } } };
    };
}
