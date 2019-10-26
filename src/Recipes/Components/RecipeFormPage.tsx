import React, { useState, useEffect, useContext } from "react";
import Fuse from "fuse.js";
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
import { ApiContext } from "../../Api/Context";
import { Food } from "../../Foods/Data";

interface RecipeFormUrlParams {
    id: string;
}

type RecipeFormProps = RouteComponentProps<RecipeFormUrlParams>;

function RecipeForm(props: RecipeFormProps): React.ReactElement {
    const api = useContext(ApiContext);
    const [recipe, setRecipe] = useState(emptyRecipe);
    const [editing, setEditing] = useState(false);

    const editingId = props.match.params.id;
    useEffect(() => {
        if (editingId) {
            const fetchRecipe = async () => {
                const loaded = await api.recipes.read(editingId);
                setRecipe(loaded);
                setEditing(true);
            };
            fetchRecipe();
        }
    }, [editingId]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const persist = async () => {
            if (editing) {
                await api.recipes.update(recipe);
            } else {
                await api.recipes.create(recipe);
            }
            props.history.push("/recipes");
        };
        persist();
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

    const foodSearch = async (search: string): Promise<Food[]> => {
        const consumables = await api.foods.autocomplete(search);
        const fuse = new Fuse(consumables, {
            keys: ["name", "brand"],
        });
        const result = fuse.search(search);
        return result;
    };

    return (
        <>
            <h1>{editing ? "Editing Recipe" : "New Recipe"}</h1>
            <IngredientsTable
                foodSearch={foodSearch}
                emptyItem={emptyIngredient}
                ingredients={recipe.ingredients.filter((ingredient) => !ingredient.isDeleted)}
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
