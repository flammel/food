import React, { useState, useEffect, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import { Recipe, nutritionData, emptyRecipe } from "../../Domain/Recipe";
import TopBar, { MenuButton, Search } from "../TopBar/TopBar";
import FloatingActionButton from "../FloatingActionButton";
import RecipeForm from "./RecipeForm";
import { nilUUID } from "../../Domain/UUID";

export default function RecipesPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const editMatch = useRouteMatch<{ id: string }>("/recipes/edit/:id");
    const addMatch = useRouteMatch("/recipes/add");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipe, setRecipe] = useState<Recipe>(emptyRecipe);
    const [search, setSearch] = useState<string>("");

    const fetchRecipes = async (): Promise<void> => {
        const result = await api.recipes.search(search);
        setRecipes(result);
    };
    useEffect(() => {
        fetchRecipes();
    }, [search]);

    useEffect(() => {
        const editingId = editMatch?.params.id;
        if (editingId) {
            const fetchFn = async (): Promise<void> => {
                const loaded = await api.recipes.read(editingId);
                if (loaded) {
                    setRecipe(loaded);
                }
            };
            fetchFn();
        } else {
            setRecipe(emptyRecipe);
        }
    }, [editMatch?.params.id]);

    return (
        <>
            <div className="main">
                <TopBar>
                    <MenuButton />
                    <Search placeholder="Search Recipes" value={search} onChange={setSearch} />
                </TopBar>
                <div className="recipes cards">
                    <div className="recipe card card--header">
                        <div className="card__name">Name</div>
                        <div className="card__servings">Servings</div>
                        <div className="card__macros">
                            <div className="card__macro">Calories</div>
                            <div className="card__macro">Carbs</div>
                            <div className="card__macro">Fat</div>
                            <div className="card__macro">Protein</div>
                        </div>
                    </div>
                    {recipes.length === 0 ? (
                        <p className="no-items">
                            No recipes. <Link to="/recipes/add">Create one?</Link>
                        </p>
                    ) : null}
                    {recipes.map((recipe) => {
                        const values = nutritionData(recipe);
                        return (
                            <Link
                                to={"/recipes/edit/" + recipe.id}
                                className={
                                    "recipe card " +
                                    (editMatch && editMatch.params.id !== recipe.id ? " card--inactive" : "") +
                                    (editMatch && editMatch.params.id === recipe.id ? " card--active" : "")
                                }
                                key={recipe.id}
                            >
                                <div className="card__name">{Formatter.recipe(recipe)}</div>
                                <div className="card__servings">
                                    {Formatter.quantity(recipe.servings)}
                                    &nbsp;
                                    {Formatter.servings(recipe.servings)}
                                </div>
                                <div className="card__macros">
                                    <div className="card__macro" data-label="Calories">
                                        {Formatter.calories(values.calories)}
                                    </div>
                                    <div className="card__macro" data-label="Carbs">
                                        {Formatter.macro(values.carbs)}
                                    </div>
                                    <div className="card__macro" data-label="Fat">
                                        {Formatter.macro(values.fat)}
                                    </div>
                                    <div className="card__macro" data-label="Protein">
                                        {Formatter.macro(values.protein)}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <FloatingActionButton target="/recipes/add" />
            </div>
            <div className={"side " + (editMatch || addMatch ? " side--visible" : "")}>
                <RecipeForm recipe={recipe} editing={recipe.id !== nilUUID} reload={fetchRecipes} />
            </div>
        </>
    );
}
