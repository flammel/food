import React, { useState } from "react";
import { Recipe, nutritionData, formatServings } from "../Data";
import { formatCalories, formatNutritionValue } from "../../Types";

interface IngredientsTableFooterProps {
    recipe: Recipe;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onServingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function Headers(): React.ReactElement {
    return (
        <div className="data-table__row">
            <div className="data-table__cell data-table__cell--header">Recipe</div>
            <div className="data-table__cell data-table__cell--header">Servings</div>
            <div className="data-table__cell data-table__cell--header">Calories</div>
            <div className="data-table__cell data-table__cell--header">Fat</div>
            <div className="data-table__cell data-table__cell--header">Carbs</div>
            <div className="data-table__cell data-table__cell--header">Protein</div>
            <div className="data-table__cell data-table__cell--header data-table__cell--actions"></div>
        </div>
    );
}

export default function IngredientsTableFooter(props: IngredientsTableFooterProps): React.ReactElement {
    const sums = nutritionData(props.recipe);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [servingsizeInvalid, setServingsizeInvalid] = useState(false);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        let valid = true;
        if (props.recipe.name.length < 1) {
            setNameInvalid(true);
            valid = false;
        } else {
            setNameInvalid(false);
        }
        if (props.recipe.servings < 1 || isNaN(props.recipe.servings)) {
            setServingsizeInvalid(true);
            valid = false;
        } else {
            setServingsizeInvalid(false);
        }
        if (valid) {
            props.onSubmit(e);
        }
    };
    return (
        <>
            <Headers />
            <form onSubmit={onSubmit} className="data-table__row">
                <div className="data-table__cell ingredients-table__cell--sums">
                    <div className="input-group">
                        <input
                            type="text"
                            className={"form-control" + (nameInvalid ? " form-control__invalid" : "")}
                            placeholder="Recipe Name"
                            value={props.recipe.name}
                            onChange={props.onNameChange}
                            autoFocus
                        />
                    </div>
                </div>
                <div className="data-table__cell ingredients-table__cell--sums">
                    <div className="input-group">
                        <input
                            type="number"
                            min="0"
                            step="1"
                            className={"form-control" + (servingsizeInvalid ? " form-control__invalid" : "")}
                            placeholder="Servings"
                            value={formatServings(props.recipe.servings)}
                            onChange={props.onServingsChange}
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">servings</div>
                        </div>
                    </div>
                </div>
                <div className="data-table__cell ingredients-table__cell--sums">
                    <span className="data-table__value">{formatCalories(sums.calories)}</span>
                </div>
                <div className="data-table__cell ingredients-table__cell--sums">
                    <span className="data-table__value">{formatNutritionValue(sums.fat)} g</span>
                </div>
                <div className="data-table__cell ingredients-table__cell--sums">
                    <span className="data-table__value">{formatNutritionValue(sums.carbs)} g</span>
                </div>
                <div className="data-table__cell ingredients-table__cell--sums">
                    <span className="data-table__value">{formatNutritionValue(sums.protein)} g</span>
                </div>
                <div className="data-table__cell ingredients-table__cell--sums data-table__cell--actions">
                    <button className="btn btn-primary action action--visible" type="submit">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
