import { NutritionData, Quantity, Unit } from "../Types";

export type FoodId = number;
export type Brand = string;
export interface Food extends NutritionData {
    readonly id: FoodId;
    readonly name: string;
    readonly brand: Brand;
    readonly quantity: Quantity;
    readonly servingSize: Quantity;
    readonly unit: Unit;
    readonly next?: FoodId;
    readonly isDeleted: boolean;
}

export const emptyFood: Food = {
    id: 0,
    name: "",
    brand: "",
    quantity: 100,
    servingSize: 100,
    unit: "g",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
    isDeleted: false,
};

export function foodLabel(food: Food): string {
    if (food.id === 0) {
        return "";
    }
    return food.name + " (" + food.brand + ")";
}
