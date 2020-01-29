import { Food, emptyFood } from "./Food";
import { Recipe } from "./Recipe";

export type Consumable = { type: "food"; value: Food } | { type: "recipe"; value: Recipe };
export const emptyConsumable: Consumable = { type: "food", value: emptyFood };
