import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import { Recipe, nutritionData } from "../../Domain/Recipe";
import TopBar, { MenuButton, Search } from "../TopBar/TopBar";

export default function RecipesPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchRecipes = async () => {
            const result = await api.recipes.search(search);
            setRecipes(result);
        };
        fetchRecipes();
    }, [search]);

    return (
        <>
            <TopBar>
                <MenuButton />
                <Search placeholder="Search Recipes" value={search} onChange={setSearch} />
            </TopBar>
            {recipes.map((recipe) => {
                const values = nutritionData(recipe);
                return (
                    <Link to={"/recipes/" + recipe.id} className="recipe" key={recipe.id}>
                        <div className="recipe__name">{Formatter.recipe(recipe)}</div>
                        <div className="recipe__servings">
                            {Formatter.quantity(recipe.servings)}
                            &nbsp;
                            {Formatter.servings(recipe.servings)}
                        </div>
                        <div className="recipe__macros">
                            <div className="recipe__macro" data-label="Calories">
                                {Formatter.calories(values.calories)}
                            </div>
                            <div className="recipe__macro" data-label="Carbs">
                                {Formatter.macro(values.carbs)}
                            </div>
                            <div className="recipe__macro" data-label="Fat">
                                {Formatter.macro(values.fat)}
                            </div>
                            <div className="recipe__macro" data-label="Protein">
                                {Formatter.macro(values.protein)}
                            </div>
                        </div>
                    </Link>
                );
            })}
            <Link className="fab" to="/recipes/add">
                <svg className="fab__icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path>
                </svg>
            </Link>
        </>
    );
}
