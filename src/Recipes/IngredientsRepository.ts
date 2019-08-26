import { Ingredient, Recipe } from "./Data";
import { uuidv4 } from "../UUID";

function create(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: [{ ...ingredient, id: uuidv4() }, ...recipe.ingredients],
    };
}

function update(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((current) => (current.id === ingredient.id ? ingredient : current)),
    };
}

function remove(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((current) =>
            current.id === ingredient.id ? { ...current, isDeleted: true } : current,
        ),
    };
}

function undoDelete(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((current) =>
            current.id === ingredient.id ? { ...current, isDeleted: false } : current,
        ),
    };
}

export default {
    create: create,
    update: update,
    delete: remove,
    undoDelete: undoDelete,
};
