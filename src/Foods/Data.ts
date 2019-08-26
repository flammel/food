import { NutritionData, Quantity, Unit } from "../Types";

export type FoodId = number;
export type Brand = string;
export type ServingSize = Quantity;
export interface Food extends NutritionData {
    readonly id: FoodId;
    readonly name: string;
    readonly brand: Brand;
    readonly quantity: Quantity;
    readonly servingSize: ServingSize;
    readonly unit: Unit;
    readonly next?: FoodId;
    readonly isDeleted: boolean;
    readonly sort: number;
}

export const emptyFood: Food = {
    id: 0,
    name: "",
    brand: "",
    quantity: 100,
    servingSize: 1,
    unit: "g",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
    isDeleted: false,
    sort: 0,
};

export function formatServingSize(servingSize: ServingSize): string {
    if (isNaN(servingSize)) {
        return "";
    }
    return servingSize.toFixed(0);
}

export function foodLabel(food: Food): string {
    if (food.id === 0) {
        return "";
    }
    if (food.brand.length === 0) {
        return food.name;
    }
    return food.name + " (" + food.brand + ")";
}
