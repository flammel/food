import { Quantity, NutritionData, formatQuantity } from "../Types";
import { emptyFood, Food } from "../Foods/Data";

type IngredientId = number;
export interface Ingredient {
    readonly id: IngredientId;
    readonly food: Food;
    readonly quantity: Quantity;
    readonly isDeleted: boolean;
}

type Servings = number;
export type RecipeId = number;
export interface Recipe {
    readonly id: RecipeId;
    readonly name: string;
    readonly servings: Servings;
    readonly ingredients: Ingredient[];
    readonly isDeleted: boolean;
}

export function recipeLabel(recipe: Recipe): string {
    return recipe.name;
}

export function nutritionData(recipe: Recipe): NutritionData {
    const data = {
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
    };
    for (const ingredient of recipe.ingredients) {
        const values = ingredientNutritionData(ingredient);
        data.calories += values.calories;
        data.fat += values.fat;
        data.carbs += values.carbs;
        data.protein += values.protein;
    }
    return data;
}

export function ingredientNutritionData(ingredient: Ingredient): NutritionData {
    return {
        calories: (ingredient.food.calories / ingredient.food.quantity) * ingredient.quantity,
        fat: (ingredient.food.fat / ingredient.food.quantity) * ingredient.quantity,
        carbs: (ingredient.food.carbs / ingredient.food.quantity) * ingredient.quantity,
        protein: (ingredient.food.protein / ingredient.food.quantity) * ingredient.quantity,
    };
}

export function formatServings(servings: Servings): string {
    return formatQuantity(servings);
}

export const emptyRecipe: Recipe = {
    id: 0,
    name: "",
    servings: 1,
    ingredients: [],
    isDeleted: false,
};

export const emptyIngredient: Ingredient = {
    id: 0,
    food: emptyFood,
    quantity: 100,
    isDeleted: false,
};
