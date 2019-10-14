import React, { useState, useEffect, useContext } from "react";
import {
    emptyRecipe,
    emptyIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    undoDeleteIngredient,
} from "../Data";
import { withRouter, RouteComponentProps } from "react-router";
import IngredientsTable from "./IngredientsTable";
import IngredientsTableFooter from "./IngredientsTableFooter";
import { AppStateContext } from "../../AppState/Context";
import { updateAction, createAction } from "../Actions";
import { sortedFoods } from "../../AppState/Functions";

interface RecipeFormUrlParams {
    id: string;
}

type RecipeFormProps = RouteComponentProps<RecipeFormUrlParams>;

function RecipeForm(props: RecipeFormProps): React.ReactElement {
    const [appState, reducer] = useContext(AppStateContext);
    const [recipe, setRecipe] = useState(emptyRecipe);
    const [editing, setEditing] = useState(false);

    const editingId = props.match.params.id;
    useEffect(() => {
        if (editingId) {
            const loaded = appState.recipes[editingId];
            if (loaded) {
                setRecipe(loaded);
                setEditing(true);
            }
        }
    }, [editingId, appState]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const action = editing ? updateAction(recipe) : createAction(recipe);
        reducer(action).then(() => props.history.push("/recipes"));
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.currentTarget.value;
        setRecipe((prev) => ({ ...prev, name }));
    };

    const onServingsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const servings = parseInt(e.currentTarget.value);
        setRecipe((prev) => ({ ...prev, servings }));
    };

    const footer = (
        <IngredientsTableFooter
            recipe={recipe}
            onNameChange={onNameChange}
            onServingsChange={onServingsChange}
            onSubmit={onSubmit}
        />
    );

    return (
        <>
            <h1>{editing ? "Editing Recipe" : "New Recipe"}</h1>
            <IngredientsTable
                emptyItem={emptyIngredient}
                ingredients={recipe.ingredients.filter((ingredient) => !ingredient.isDeleted)}
                foods={sortedFoods(appState)}
                onCreate={(item) =>
                    new Promise((resolve) => {
                        setRecipe(addIngredient(item, recipe));
                        resolve();
                    })
                }
                onUpdate={(item) =>
                    new Promise((resolve) => {
                        setRecipe(updateIngredient(item, recipe));
                        resolve();
                    })
                }
                onDelete={(item) =>
                    new Promise((resolve) => {
                        setRecipe(deleteIngredient(item, recipe));
                        resolve();
                    })
                }
                onUndoDelete={(item) =>
                    new Promise((resolve) => {
                        setRecipe(undoDeleteIngredient(item, recipe));
                        resolve();
                    })
                }
                footer={footer}
            />
        </>
    );
}

export default withRouter(RecipeForm);
