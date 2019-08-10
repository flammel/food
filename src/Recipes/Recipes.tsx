import React, { useState } from "react";
import { Recipe } from "./Data";
import RecipesRepository from "./RecipesRepository";
import RecipesTable from "./RecipesTable";

export default function Recipes() {
    const [recipes, setRecipes] = useState(RecipesRepository.load());
    const repoAction = (action: (recipe: Recipe) => void) => {
        return (recipe: Recipe) => {
            action(recipe);
            setRecipes(RecipesRepository.load());
        };
    };
    return (
        <>
            <RecipesTable
                recipes={recipes}
                onCreate={repoAction(RecipesRepository.create)}
                onUpdate={repoAction(RecipesRepository.update)}
                onDelete={repoAction(RecipesRepository.delete)}
                onUndoDelete={repoAction(RecipesRepository.undoDelete)}
            />
        </>
    );
}
