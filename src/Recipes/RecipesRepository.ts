import { Recipe, RecipeId } from "./Data";

function load(): Recipe[] {
    const items: Recipe[] = JSON.parse(window.localStorage.getItem("recipes")) || [];
    return items.filter((i) => !i.isDeleted);
}

function create(newRecipeData: Recipe) {
    const id = Math.floor(Math.random() * 1000000);
    const newRecipe = { ...newRecipeData, id };
    window.localStorage.setItem("recipes", JSON.stringify([...load(), newRecipe]));
}

function update(recipe: Recipe) {
    const id = Math.floor(Math.random() * 1000000);
    const newRecipe = { ...recipe, id };
    window.localStorage.setItem(
        "recipes",
        JSON.stringify([
            ...load().map((i) => (i.id === recipe.id ? { ...i, next: newRecipe.id } : i)),
            newRecipe,
        ]),
    );
}

function remove(recipe: Recipe) {
    window.localStorage.setItem(
        "recipes",
        JSON.stringify(load().map((i) => (i.id === recipe.id ? { ...recipe, isDeleted: true } : i))),
    );
}

function undoDelete(recipe: Recipe) {
    window.localStorage.setItem(
        "recipes",
        JSON.stringify(load().map((i) => (i.id === recipe.id ? { ...recipe, isDeleted: false } : i))),
    );
}

function byId(id: RecipeId): Recipe | null {
    for (const recipe of load()) {
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
    byId: byId
}
