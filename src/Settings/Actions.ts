import { Action, AppState } from "../AppState/Types";
import { Settings } from "./Data";

export function saveAction(settings: Settings): Action {
    return (prev: AppState) => {
        return { ...prev, settings };
    };
}
