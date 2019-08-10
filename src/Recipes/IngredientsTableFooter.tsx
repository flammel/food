import React from "react";
import { Recipe, nutritionData, formatServings } from "./Data";
import { formatCalories, formatNutritionValue } from "../Types";

interface IngredientsTableFooterProps {
    recipe: Recipe;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onServingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Headers() {
    return (
        <div className="data-table__row">
            <div className="data-table__cell data-table__cell--header data-table__cell--food">Recipe</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--quantity">Servings</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--calories">Calories</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--fat">Fat</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--carbs">Carbs</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--protein">Protein</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--actions"></div>
        </div>
    );
}

export default function IngredientsTableFooter(props: IngredientsTableFooterProps) {
    const sums = nutritionData(props.recipe);
    return (
        <>
            <Headers />
            <form onSubmit={props.onSubmit} className="data-table__row">
                <div className="data-table__cell data-table__cell--food ingredients-table__cell--sums">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Recipe Name"
                            value={props.recipe.name}
                            onChange={props.onNameChange}
                            autoFocus
                        />
                    </div>
                </div>
                <div className="data-table__cell data-table__cell--quantity ingredients-table__cell--sums">
                    <div className="input-group">
                        <input
                            type="number"
                            min="0"
                            step="1"
                            className="form-control"
                            placeholder="Servings"
                            value={formatServings(props.recipe.servings)}
                            onChange={props.onServingsChange}
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">servings</div>
                        </div>
                    </div>
                </div>
                <div className="data-table__cell data-table__cell--calories ingredients-table__cell--sums">
                    <span className="data-table__value">{formatCalories(sums.calories)}</span>
                </div>
                <div className="data-table__cell data-table__cell--fat ingredients-table__cell--sums">
                    <span className="data-table__value">{formatNutritionValue(sums.fat)} g</span>
                </div>
                <div className="data-table__cell data-table__cell--carbs ingredients-table__cell--sums">
                    <span className="data-table__value">{formatNutritionValue(sums.carbs)} g</span>
                </div>
                <div className="data-table__cell data-table__cell--protein ingredients-table__cell--sums">
                    <span className="data-table__value">{formatNutritionValue(sums.protein)} g</span>
                </div>
                <div className="data-table__cell data-table__cell--actions ingredients-table__cell--sums">
                    <button className="btn btn-primary action action--larger action--visible" type="submit">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
