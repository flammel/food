import React, { useState, useEffect, useContext } from "react";
import Fuse from "fuse.js";
import {
    emptyRecipe,
    emptyIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    undoDeleteIngredient,
} from "../../Domain/Recipe";
import { withRouter, RouteComponentProps } from "react-router";
import { ApiContext } from "../../Api/Context";
import { Food } from "../../Domain/Food";
import TopBar, { BackButton, Action } from "../TopBar/TopBar";
import Formatter from "../../Formatter";

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

    const foodSearch = async (search: string): Promise<Food[]> => {
        const consumables = await api.foods.autocomplete(search);
        const fuse = new Fuse(consumables, {
            keys: ["name", "brand"],
        });
        const result = fuse.search(search);
        return result;
    };

    const onDelete = (): void => {
        const deleteFn = async () => {
            await api.recipes.delete(recipe)
            props.history.push("/recipes");
        };
        deleteFn();
    };

    return (
        <>
            <TopBar>
                <BackButton />
                {editing ? "Edit Recipe" : "New Recipe"}
                {editing ? <Action icon="delete" action={onDelete} /> : null}
            </TopBar>

            <form onSubmit={onSubmit} className="form">
                <div className="input-group">
                    <label className="input-group__label">Name</label>
                    <input className="input-group__input" type="text" required value={recipe.name} onChange={(e) => {
                        const name = e.target.value;
                        setRecipe((prev) => ({ ...prev, name: name }));
                    }} />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Servings</label>
                    <input className="input-group__input" type="number" min="0" step="1" required value={Formatter.quantity(recipe.servings)} onChange={(e) => {
                        const servings = parseInt(e.target.value);
                        setRecipe((prev) => ({ ...prev, servings }));
                    }} />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Ingredients</label>
                </div>
                {recipe.ingredients.map((ingredient) => {
                    return (
                        <div className="ingredient" key={ingredient.id}>
                            <div className="ingredient__name">{Formatter.food(ingredient.food)}</div>
                            <div className="ingredient__quantity">
                                {Formatter.quantity(ingredient.food.defaultQuantity)}
                                &nbsp;
                                {ingredient.food.unit}
                            </div>
                        </div>
                    );
                })}
                <div className="form__buttons">
                    <button type="submit" className="button button--primary">Save</button>
                </div>
            </form>
        </>
    );
}

export default withRouter(RecipeForm);
