import { Food } from "./Domain/Food";
import { nilUUID } from "./Domain/UUID";
import { Consumable } from "./Domain/Consumable";
import { Macro, Calories } from "./Domain/NutritionData";
import { Quantity } from "./Domain/Quantity";

const foodLabel = (food: Food) => {
    if (food.id === nilUUID) {
        return "";
    }
    if (food.brand.length === 0) {
        return food.name;
    }
    return food.name + " (" + food.brand + ")";
};

export default {
    food: foodLabel,
    consumable: (consumable: Consumable) => {
        if (consumable.type === "food") {
            return foodLabel(consumable.value);
        } else {
            return consumable.value.name;
        }
    },
    consumableUnit: (consumable: Consumable) => {
        if (consumable.type === "food") {
            return consumable.value.unit;
        } else {
            return "serv";
        }
    },
    quantity: (value: Quantity) => isNaN(value) ? "0" : value.toFixed(0),
    calories: (value: Calories) => isNaN(value) ? "0" : value.toFixed(0),
    macro: (value: Macro) => isNaN(value) ? "0" : value.toFixed(1),
};