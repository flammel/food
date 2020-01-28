import { UUID, nilUUID } from "./UUID";
import { NutritionData } from "./NutritionData";
import { Quantity } from "./Quantity";
import { Unit } from "./Unit";

export type FoodId = UUID;
export type Brand = string;

export interface Food extends NutritionData {
    readonly id: FoodId;
    readonly name: string;
    readonly brand: Brand;
    readonly defaultQuantity: Quantity;
    readonly unit: Unit;
    readonly isDeleted: boolean;
    readonly sort: number;
}

export const emptyFood: Food = {
    id: nilUUID,
    name: "",
    brand: "",
    defaultQuantity: 1,
    unit: "g",
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
    isDeleted: false,
    sort: 0,
};
