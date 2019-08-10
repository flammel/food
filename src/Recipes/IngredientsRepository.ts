import { Ingredient, Recipe } from "./Data";

function create(ingredient: Ingredient, recipe: Recipe): Recipe {
    return {
        ...recipe,
        ingredients: [...recipe.ingredients, { ...ingredient, id: recipe.ingredients.length + 1 }],
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
