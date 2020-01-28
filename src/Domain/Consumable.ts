import { Food } from "./Food";
import { Recipe } from "./Recipe";

export type Consumable = {type: "food", value: Food} | {type: "recipe", value: Recipe};
