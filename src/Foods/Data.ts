import { NutritionData, Unit } from "../Types";
import Fuse from "fuse.js";

export type FoodId = number;

export interface Food extends NutritionData {
    readonly id: FoodId;
    readonly brand: string;
    readonly name: string;
    readonly unit: Unit;
    readonly next?: Food;
}

export const emptyFood: Food = {
    id: 0,
    name: "",
    brand: "",
    quantity: 100,
    unit: "g",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
};

export function loadFoods(): Food[] {
    const items: Food[] = JSON.parse(window.localStorage.getItem("foods")) || [];
    return items.filter((i) => !i.next);
}

export function saveFood(newFoodData: Food, oldFood?: Food) {
    const id = Math.floor(Math.random() * 1000000);
    const newFood = { ...newFoodData, id };
    window.localStorage.setItem(
        "foods",
        JSON.stringify([
            ...loadFoods().map((i) => (oldFood && i.id === oldFood.id ? { ...i, next: newFood.id } : i)),
            newFood,
        ]),
    );
}

export function deleteFood(food: Food) {
    window.localStorage.setItem("foods", JSON.stringify(loadFoods().filter((i) => i.id !== food.id)));
}

export function foodSearch(foods: Food[], search: string | null): Food[] {
    const fuse = new Fuse(foods, {
        keys: ["name", "brand"],
    });
    const result = fuse.search(search);
    return result;
}

export function foodLabel(food: Food): string {
    if (food.id === 0) {
        return "";
    }
    return food.name + " (" + food.brand + ")";
}
