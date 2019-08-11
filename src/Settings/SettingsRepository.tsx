import { Settings } from "./Data";

const emptySettings: Settings = {
    targetCalories: 1700,
    targetFat: 100,
    targetCarbs: 100,
    targetProtein: 100,
};

function load(): Settings {
    const json = window.localStorage.getItem("settings");
    if (json) {
        const parsed = JSON.parse(json);
        if (parsed) {
            return parsed;
        }
    }
    return emptySettings;
}

function update(settings: Settings): void {
    window.localStorage.setItem("settings", JSON.stringify(settings));
}

export default {
    load: load,
    update: update,
};
