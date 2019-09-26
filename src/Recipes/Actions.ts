import { uuidv4 } from "../UUID";
import { Action, AppState } from "../AppState/Types";
import { Recipe } from "./Data";

export function createAction(recipe: Recipe): Action {
    return (prev: AppState) => {
        const id = uuidv4();
        return { ...prev, recipes: { ...prev.recipes, [id]: { ...recipe, id, sort: new Date().valueOf() } } };
    };
}

export function updateAction(recipe: Recipe): Action {
    return (prev: AppState) => {
        return { ...prev, recipes: { ...prev.recipes, [recipe.id]: recipe } };
    };
}

export function deleteAction(recipe: Recipe): Action {
    return (prev: AppState) => {
        return { ...prev, recipes: { ...prev.recipes, [recipe.id]: { ...recipe, isDeleted: true } } };
    };
}

export function undoDeleteAction(recipe: Recipe): Action {
    return (prev: AppState) => {
        return { ...prev, recipes: { ...prev.recipes, [recipe.id]: { ...recipe, isDeleted: false } } };
    };
}

export function duplicateAction(recipe: Recipe): Action {
    return (prev: AppState) => {
        const id = uuidv4();
        return { ...prev, recipes: { ...prev.recipes, [id]: { ...recipe, id } } };
    };
}
