import React, { useState, useEffect } from "react";
import { Recipe, emptyRecipe, Ingredient, emptyIngredient } from "./Data";
import FoodsRepository from "../Foods/FoodsRepository";
import RecipesRepository from "./RecipesRepository";
import IngredientsRepository from "./IngredientsRepository";
import { withRouter, RouteComponentProps } from "react-router";
import IngredientsTable from "./IngredientsTable";
import IngredientsTableFooter from "./IngredientsTableFooter";

interface RecipeFormUrlParams {
    id: string;
}

interface RecipeFormProps extends RouteComponentProps<RecipeFormUrlParams> {}

function RecipeForm(props: RecipeFormProps) {
    const [recipe, setRecipe] = useState(emptyRecipe);
    const [editing, setEditing] = useState(false);

    const editingId = parseInt(props.match.params.id);
    useEffect(() => {
        if (editingId) {
            const loaded = RecipesRepository.byId(editingId);
            if (loaded) {
                setRecipe(loaded);
                setEditing(true);
            }
        }
    }, [editingId]);

    const repoAction = (action: (ingredient: Ingredient, recipe: Recipe) => Recipe) => {
        return (ingredient: Ingredient) => {
            setRecipe((prev) => action(ingredient, prev));
        };
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editing) {
            RecipesRepository.update(recipe);
        } else {
            RecipesRepository.create(recipe);
        }
        props.history.push("/recipes");
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.value;
        setRecipe((prev) => ({ ...prev, name }));
    };

    const onServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const servings = parseInt(e.currentTarget.value);
        if (servings >= 0) {
            setRecipe((prev) => ({ ...prev, servings }));
        }
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
                ingredients={recipe.ingredients}
                foods={FoodsRepository.load()}
                onCreate={repoAction(IngredientsRepository.create)}
                onUpdate={repoAction(IngredientsRepository.update)}
                onDelete={repoAction(IngredientsRepository.delete)}
                onUndoDelete={repoAction(IngredientsRepository.undoDelete)}
                footer={footer}
            />
        </>
    );
}

export default withRouter(RecipeForm);
