import React, { useState } from "react";
import { Recipe } from "./Data";
import RecipesRepository from "./RecipesRepository";
import RecipesTable from "./RecipesTable";
import { withRouter, RouteComponentProps } from "react-router";

interface RecipesPageProps extends RouteComponentProps {}

function Recipes(props: RecipesPageProps) {
    const [recipes, setRecipes] = useState(RecipesRepository.load());
    const repoAction = (action: (recipe: Recipe) => void) => {
        return (recipe: Recipe) => {
            action(recipe);
            setRecipes(RecipesRepository.load());
        };
    };
    const goToEdit = (item: Recipe) => {
        props.history.push("/recipes/" + item.id);
    };
    return (
        <>
            <RecipesTable
                recipes={recipes}
                onCreate={repoAction(RecipesRepository.create)}
                onUpdate={repoAction(RecipesRepository.update)}
                onDelete={repoAction(RecipesRepository.delete)}
                onUndoDelete={repoAction(RecipesRepository.undoDelete)}
                goToEdit={goToEdit}
            />
        </>
    );
}

export default withRouter(Recipes);
