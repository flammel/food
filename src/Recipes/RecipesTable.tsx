import React from "react";
import { emptyRecipe, Recipe, nutritionData } from "./Data";
import { formatNutritionValue, formatCalories } from "../Types";
import DataTable, { DataTableColumn } from "../DataTable/DataTable";
import { Link } from "react-router-dom";

interface RecipesTableProps {
    recipes: Recipe[];
    onCreate: (newItem: Recipe) => void;
    onUpdate: (newItem: Recipe) => void;
    onDelete: (item: Recipe) => void;
    onUndoDelete: (item: Recipe) => void;
}

function CreateForm() {
    return (
        <div className="data-table__row recipes-table__row--create-link">
            <div className="data-table__cell data-table__cell--full-width">
                <Link to="/recipes/new" className="btn btn-primary">
                    Create a new recipe
                </Link>
            </div>
        </div>
    );
}

export default function RecipesTable(props: RecipesTableProps) {
    const columns: Array<DataTableColumn<Recipe>> = [
        {
            id: "food",
            label: "Recipe",
            value: (item: Recipe) => item.name,
        },
        {
            id: "servings",
            label: "Servings",
            value: (item: Recipe) => item.servings + "",
        },
        {
            id: "calories",
            label: "Calories",
            value: (item: Recipe) => formatCalories(nutritionData(item).calories),
        },
        {
            id: "fat",
            label: "Fat",
            value: (item: Recipe) => formatNutritionValue(nutritionData(item).fat) + " g",
        },
        {
            id: "carbs",
            label: "Carbs",
            value: (item: Recipe) => formatNutritionValue(nutritionData(item).carbs) + " g",
        },
        {
            id: "protein",
            label: "Protein",
            value: (item: Recipe) => formatNutritionValue(nutritionData(item).protein) + " g",
        },
    ];
    return (
        <DataTable
            columns={columns}
            className={"recipes-table"}
            items={props.recipes}
            emptyItem={emptyRecipe}
            idGetter={(item: Recipe) => item.id + ""}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            createForm={<CreateForm />}
        />
    );
}
