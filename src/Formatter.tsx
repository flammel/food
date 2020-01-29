import { Food } from "./Domain/Food";
import { nilUUID } from "./Domain/UUID";
import { Consumable } from "./Domain/Consumable";
import { Macro, Calories } from "./Domain/NutritionData";
import { Quantity } from "./Domain/Quantity";
import { Recipe } from "./Domain/Recipe";

const foodLabel = (food: Food) => {
    if (food.id === nilUUID) {
        return "";
    }
    if (food.brand.length === 0) {
        return food.name;
    }
    return food.name + " (" + food.brand + ")";
};

const servings = (quantity: Quantity): string => {
    return quantity === 1 ? "serving" : "servings";
}

export default {
    food: foodLabel,
    recipe: (recipe: Recipe) => recipe.name,
    consumable: (consumable: Consumable) => {
        if (consumable.type === "food") {
            return foodLabel(consumable.value);
        } else {
            return consumable.value.name;
        }
    },
    consumableUnit: (consumable: Consumable, quantity: Quantity) => {
        if (consumable.type === "food") {
            return consumable.value.unit;
        } else {
            return servings(quantity);
        }
    },
    servings: servings,
    quantity: (value: Quantity) => (isNaN(value) ? "0" : value.toFixed(0)),
    calories: (value: Calories) => (isNaN(value) ? "0" : value.toFixed(0)),
    macro: (value: Macro) => (isNaN(value) ? "0" : value.toFixed(1)),
};
