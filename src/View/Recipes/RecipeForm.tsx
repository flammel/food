import React, { useState, useEffect, useContext } from "react";
import {
    emptyIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    Ingredient,
    Recipe,
} from "../../Domain/Recipe";
import { useHistory } from "react-router";
import { ApiContext } from "../../Api/Context";
import { Food, emptyFood } from "../../Domain/Food";
import TopBar, { BackButton, Action, Title } from "../TopBar/TopBar";
import Formatter from "../../Formatter";
import ComboBox from "../ComboBox/ComboBox";
import { Snackbar, SnackbarContext } from "../Snackbar";
import NumberInput from "../NumberInput";
import { IconCircledPlus, IconCircledMinus } from "../Icons";

interface RecipeFormProps {
    recipe: Recipe;
    editing: boolean;
    reload: () => void;
}

export default function RecipeFormPage(props: RecipeFormProps): React.ReactElement {
    const history = useHistory();
    const snackbar = useContext(SnackbarContext);
    const api = useContext(ApiContext);
    const [recipe, setRecipe] = useState(props.recipe);

    useEffect(() => setRecipe(props.recipe), [props.recipe.id]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const persist = async (): Promise<void> => {
            if (props.editing) {
                await api.recipes.update(recipe);
            } else {
                await api.recipes.create(recipe);
            }
            props.reload();
            history.push("/recipes");
        };
        persist();
    };

    const foodSearch = async (search: string): Promise<Food[]> => {
        return await api.foods.autocomplete(search);
    };

    const onSelect = (ingredient: Ingredient) => {
        return (food: Food | null) =>
            setRecipe((prev) =>
                updateIngredient(
                    { ...ingredient, food: food || emptyFood, quantity: food?.defaultQuantity || 1 },
                    prev,
                ),
            );
    };

    const onDelete = (): void => {
        const deleteFn = async (): Promise<void> => {
            await api.recipes.delete(recipe);
            history.push("/recipes");
            props.reload();
            snackbar.show(
                <Snackbar
                    text={"Deleted " + Formatter.recipe(recipe)}
                    action={{
                        text: "Undo",
                        fn: () => {
                            api.recipes.undoDelete(recipe);
                            props.reload();
                        },
                    }}
                />,
            );
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
                <BackButton to="/recipes" />
                <Title>{props.editing ? "Edit Recipe" : "New Recipe"}</Title>
                {props.editing ? <Action icon="delete" action={onDelete} /> : null}
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
                    <NumberInput
                        name="servings"
                        decimal={false}
                        value={recipe.servings}
                        onChange={(servings) => setRecipe((prev) => ({ ...prev, servings }))}
                    />
                </div>
                <div className="ingredients">
                    <div className="ingredients__header">
                        <label className="ingredients__label">Ingredients</label>
                        <button className="ingredient__button" type="button" onClick={onIngredientAdd}>
                            <IconCircledPlus className="ingredient__icon" />
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
                                    <NumberInput
                                        className="ingredient__quantity"
                                        name="quantity"
                                        decimal={false}
                                        value={ingredient.quantity}
                                        onChange={(quantity) =>
                                            setRecipe((prev) => updateIngredient({ ...ingredient, quantity }, prev))
                                        }
                                    />
                                    <span className="ingredient__unit">{ingredient.food.unit}</span>
                                    <button
                                        className="ingredient__button"
                                        type="button"
                                        onClick={onIngredientDelete(ingredient)}
                                    >
                                        <IconCircledMinus className="ingredient__icon" />
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
