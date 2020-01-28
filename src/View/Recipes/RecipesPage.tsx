import React, { useState, useEffect, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Recipe, emptyRecipe } from "../../Domain/Recipe";
import RecipesTable from "./RecipesTable";
import { ApiContext } from "../../Api/Context";
import TopBar, { MenuButton } from "../TopBar/TopBar";

type RecipesPageProps = RouteComponentProps;

function Recipes(props: RecipesPageProps): React.ReactElement {
    const api = useContext(ApiContext);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const fetchRecipes = async () => {
        const result = await api.recipes.load();
        setRecipes(result);
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const goToEdit = (item: Recipe): void => {
        props.history.push("/recipes/" + item.id);
    };

    return (
        <>
        <TopBar>
            <MenuButton />
            Recipes
        </TopBar>
            <RecipesTable
                recipes={recipes}
                emptyItem={emptyRecipe}
                onCreate={(item) => api.recipes.create(item)}
                onUpdate={(item) => api.recipes.update(item)}
                onDelete={(item) => api.recipes.delete(item).then(fetchRecipes)}
                onUndoDelete={(item) => api.recipes.undoDelete(item).then(fetchRecipes)}
                onDuplicate={(item) => api.recipes.duplicate(item).then(fetchRecipes)}
                goToEdit={goToEdit}
            />
        </>
    );
}

export default withRouter(Recipes);
