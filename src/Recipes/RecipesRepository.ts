import { Recipe, RecipeId, Ingredient } from "./Data";
import { FoodId } from "../Foods/Data";
import FoodsRepository from "../Foods/FoodsRepository";
import { notEmpty } from "../Types";
import { uuidv4 } from "../UUID";

interface SerializedIngredient extends Omit<Ingredient, "food"> {
    foodId: FoodId;
}

interface SerializedRecipe extends Omit<Recipe, "ingredients"> {
    ingredients: SerializedIngredient[];
}

function ingredientFromJson(json: SerializedIngredient): Ingredient | null {
    const food = FoodsRepository.byId(json.foodId);
    if (food === null) {
        return null;
    }
    return {
        id: json.id,
        food: food,
        quantity: json.quantity,
        isDeleted: json.isDeleted,
    };
}

function fromJson(json: SerializedRecipe): Recipe {
    return {
        id: json.id,
        name: json.name,
        servings: json.servings,
        ingredients: json.ingredients.map(ingredientFromJson).filter(notEmpty),
        isDeleted: json.isDeleted,
    };
}

function toJson(recipe: Recipe): SerializedRecipe {
    const ingredients = recipe.ingredients.map((ingredient) => ({
        id: ingredient.id,
        foodId: ingredient.food.id,
        quantity: ingredient.quantity,
        isDeleted: ingredient.isDeleted,
    }));
    return {
        id: recipe.id,
        name: recipe.name,
        servings: recipe.servings,
        ingredients: ingredients,
        isDeleted: recipe.isDeleted,
    };
}

function loadIncludingDeleted(): Recipe[] {
    const json = window.localStorage.getItem("recipes");
    if (json) {
        const parsed = JSON.parse(json);
        if (parsed) {
            return parsed.map(fromJson);
        }
    }
    return [];
}

function store(items: Recipe[]): void {
    window.localStorage.setItem("recipes", JSON.stringify(items.map(toJson)));
}

function load(): Recipe[] {
    return loadIncludingDeleted().filter((i) => !i.isDeleted);
}

function create(newRecipeData: Recipe): Recipe {
    const newRecipe = { ...newRecipeData, id: uuidv4() };
    store([...loadIncludingDeleted(), newRecipe]);
    return newRecipe;
}

function update(recipe: Recipe): void {
    store([...loadIncludingDeleted().map((i) => (i.id === recipe.id ? recipe : i))]);
}

function remove(recipe: Recipe): void {
    store(loadIncludingDeleted().map((i) => (i.id === recipe.id ? { ...recipe, isDeleted: true } : i)));
}

function undoDelete(recipe: Recipe): void {
    store(loadIncludingDeleted().map((i) => (i.id === recipe.id ? { ...recipe, isDeleted: false } : i)));
}

function byId(id: RecipeId): Recipe | null {
    for (const recipe of loadIncludingDeleted()) {
        if (recipe.id === id) {
            return recipe;
        }
    }
    return null;
}

export default {
    load: load,
    create: create,
    update: update,
    delete: remove,
    undoDelete: undoDelete,
    duplicate: create,
    byId: byId,
};
