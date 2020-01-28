import { emptyFood, Food } from "./Food";
import { UUID, nilUUID, uuidv4 } from "./UUID";
import { Quantity } from "./Quantity";
import { NutritionData } from "./NutritionData";

type IngredientId = UUID;
type Servings = number;
export type RecipeId = UUID;

export interface Ingredient {
    readonly id: IngredientId;
    readonly food: Food;
    readonly quantity: Quantity;
    readonly isDeleted: boolean;
    readonly sort: number;
}

export interface Recipe {
    readonly id: RecipeId;
    readonly name: string;
    readonly servings: Servings;
    readonly ingredients: Ingredient[];
    readonly isDeleted: boolean;
    readonly sort: number;
}

export const emptyRecipe: Recipe = {
    id: nilUUID,
    name: "",
    servings: 1,
    ingredients: [],
    isDeleted: false,
    sort: 0,
};

export const emptyIngredient: Ingredient = {
    id: nilUUID,
    food: emptyFood,
    quantity: 1,
    isDeleted: false,
    sort: 0,
};

export function recipeLabel(recipe: Recipe): string {
    return recipe.name;
}

export function ingredientNutritionData(ingredient: Ingredient): NutritionData {
    return {
        calories: (ingredient.food.calories / 100) * ingredient.quantity,
        fat: (ingredient.food.fat / 100) * ingredient.quantity,
        carbs: (ingredient.food.carbs / 100) * ingredient.quantity,
        protein: (ingredient.food.protein / 100) * ingredient.quantity,
    };
}

export function nutritionData(recipe: Recipe): NutritionData {
    const data = {
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
    };
    for (const ingredient of recipe.ingredients) {
        if (!ingredient.isDeleted) {
            const values = ingredientNutritionData(ingredient);
            data.calories += values.calories;
            data.fat += values.fat;
            data.carbs += values.carbs;
            data.protein += values.protein;
        }
    }
    return data;
}

export function addIngredient(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: [{ ...ingredient, id: uuidv4(), sort: new Date().valueOf() }, ...recipe.ingredients],
    };
}

export function updateIngredient(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((current) => (current.id === ingredient.id ? ingredient : current)),
    };
}

export function deleteIngredient(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((current) =>
            current.id === ingredient.id ? { ...current, isDeleted: true } : current,
        ),
    };
}

export function undoDeleteIngredient(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((current) =>
            current.id === ingredient.id ? { ...current, isDeleted: false } : current,
        ),
    };
}
