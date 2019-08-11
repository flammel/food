import { Recipe, RecipeId } from "./Data";

function loadIncludingDeleted(): Recipe[] {
    const json = window.localStorage.getItem("recipes");
    if (json) {
        const parsed = JSON.parse(json);
        if (parsed) {
            return parsed;
        }
    }
    return [];
}

function load(): Recipe[] {
    return loadIncludingDeleted().filter((i) => !i.isDeleted);
}

function create(newRecipeData: Recipe): Recipe {
    const id = Math.floor(Math.random() * 1000000);
    const newRecipe = { ...newRecipeData, id };
    window.localStorage.setItem("recipes", JSON.stringify([...loadIncludingDeleted(), newRecipe]));
    return newRecipe;
}

function update(recipe: Recipe): void {
    window.localStorage.setItem(
        "recipes",
        JSON.stringify([...loadIncludingDeleted().map((i) => (i.id === recipe.id ? recipe : i))]),
    );
}

function remove(recipe: Recipe): void {
    window.localStorage.setItem(
        "recipes",
        JSON.stringify(loadIncludingDeleted().map((i) => (i.id === recipe.id ? { ...recipe, isDeleted: true } : i))),
    );
}

function undoDelete(recipe: Recipe): void {
    window.localStorage.setItem(
        "recipes",
        JSON.stringify(loadIncludingDeleted().map((i) => (i.id === recipe.id ? { ...recipe, isDeleted: false } : i))),
    );
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
