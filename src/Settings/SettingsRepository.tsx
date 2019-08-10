import { Settings } from "./Data";

const emptySettings: Settings = {
    targetCalories: 1700,
    targetFat: 100,
    targetCarbs: 100,
    targetProtein: 100,
};

function load(): Settings {
    return JSON.parse(window.localStorage.getItem("settings")) || emptySettings;
}

function update(settings: Settings) {
    window.localStorage.setItem("settings", JSON.stringify(settings));
}

export default {
    load: load,
    update: update,
};
