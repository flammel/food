import React, { useState, useEffect, useContext } from "react";
import {
    emptyRecipe,
    emptyIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    Ingredient,
} from "../../Domain/Recipe";
import { useHistory, useParams } from "react-router";
import { ApiContext } from "../../Api/Context";
import { Food, emptyFood } from "../../Domain/Food";
import TopBar, { BackButton, Action, Title } from "../TopBar/TopBar";
import Formatter from "../../Formatter";
import ComboBox from "../ComboBox/ComboBox";

export default function RecipeForm(): React.ReactElement {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const api = useContext(ApiContext);
    const [recipe, setRecipe] = useState(emptyRecipe);
    const [editing, setEditing] = useState(false);

    const editingId = params.id;
    useEffect(() => {
        if (editingId) {
            const fetchRecipe = async (): Promise<void> => {
                const loaded = await api.recipes.read(editingId);
                setRecipe(loaded);
                setEditing(true);
            };
            fetchRecipe();
        }
    }, [editingId]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const persist = async (): Promise<void> => {
            if (editing) {
                await api.recipes.update(recipe);
            } else {
                await api.recipes.create(recipe);
            }
            history.push("/recipes");
        };
        persist();
    };

    const foodSearch = async (search: string): Promise<Food[]> => {
        return await api.foods.autocomplete(search);
    };

    const onSelect = (ingredient: Ingredient) => {
        return (food: Food | null) =>
            setRecipe((prev) => updateIngredient({ ...ingredient, food: food || emptyFood }, prev));
    };

    const onDelete = (): void => {
        const deleteFn = async (): Promise<void> => {
            await api.recipes.delete(recipe);
            history.push("/recipes");
        };
        deleteFn();
    };

    const onIngredientDelete = (ingredient: Ingredient) => {
        return (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setRecipe((prev) => deleteIngredient(ingredient, prev));
        };
    };

    const onIngredientAdd = (e: React.FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setRecipe((prev) => addIngredient(emptyIngredient, prev));
    };

    return (
        <>
            <TopBar>
                <BackButton />
                <Title>{editing ? "Edit Recipe" : "New Recipe"}</Title>
                {editing ? <Action icon="delete" action={onDelete} /> : null}
            </TopBar>

            <form onSubmit={onSubmit} className="form recipe-form">
                <div className="input-group">
                    <label className="input-group__label">Name</label>
                    <input
                        className="input-group__input"
                        type="text"
                        required
                        value={recipe.name}
                        onChange={(e) => {
                            const name = e.target.value;
                            setRecipe((prev) => ({ ...prev, name: name }));
                        }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Servings</label>
                    <input
                        className="input-group__input"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={Formatter.quantity(recipe.servings)}
                        onChange={(e) => {
                            const servings = parseInt(e.target.value);
                            setRecipe((prev) => ({ ...prev, servings }));
                        }}
                    />
                </div>
                <div className="ingredients">
                    <div className="ingredients__header">
                        <label className="ingredients__label">Ingredients</label>
                        <button className="ingredient__button" type="button" onClick={onIngredientAdd}>
                            <svg className="ingredient__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                            </svg>
                        </button>
                    </div>
                    {recipe.ingredients
                        .filter((i) => !i.isDeleted)
                        .map((ingredient) => {
                            return (
                                <div className="ingredient" key={ingredient.id}>
                                    <ComboBox
                                        onSelect={onSelect(ingredient)}
                                        selected={ingredient.food}
                                        itemLabel={(food) => Formatter.food(food)}
                                        itemKey={(food) => food.id.toString()}
                                        search={foodSearch}
                                        autoFocus={true}
                                        isInvalid={false}
                                    />
                                    <input
                                        className="ingredient__quantity"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={Formatter.quantity(ingredient.quantity)}
                                        onChange={(e) => {
                                            const changed = { ...ingredient, quantity: parseInt(e.target.value) };
                                            setRecipe((prev) => updateIngredient(changed, prev));
                                        }}
                                    />
                                    <span className="ingredient__unit">{ingredient.food.unit}</span>
                                    <button
                                        className="ingredient__button"
                                        type="button"
                                        onClick={onIngredientDelete(ingredient)}
                                    >
                                        <svg className="ingredient__icon" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <div className="form__buttons">
                    <button type="submit" className="button button--primary">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
