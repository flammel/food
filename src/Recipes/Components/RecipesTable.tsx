import React, { useState } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { Recipe, nutritionData } from "../Data";
import { formatNutritionValue, formatCalories } from "../../Types";
import DataTable, { ColumnDefinition, BaseTableProps } from "../../DataTable/DataTable";

interface RecipesTableProps extends BaseTableProps<Recipe> {
    recipes: Recipe[];
    goToEdit: (item: Recipe) => void;
}

function CreateForm(): React.ReactElement {
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

function search(recipes: Recipe[], name: string): Recipe[] {
    if (name.length > 0) {
        const fuse = new Fuse(recipes, {
            keys: ["name"],
        });
        return fuse.search(name);
    } else {
        return recipes;
    }
}

export default function RecipesTable(props: RecipesTableProps): React.ReactElement {
    const [searchName, setSearchName] = useState("");
    const filteredRecipes = search(props.recipes, searchName);
    const columns: ColumnDefinition<Recipe> = [
        {
            id: "food",
            label: "Recipe",
            value: (item: Recipe) => item.name,
            header: (
                <>
                    Recipe
                    <input
                        type="text"
                        className="form-control data-table__search-input"
                        placeholder="Search"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </>
            ),
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
            items={filteredRecipes}
            emptyItem={props.emptyItem}
            idGetter={(item: Recipe) => item.id + ""}
            labelGetter={(item: Recipe) => item.name}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            onDuplicate={props.onDuplicate}
            rows={{ subHeader: <CreateForm /> }}
            editUrl={{
                url: (item: Recipe) => "/recipes/" + item.id,
                redirect: props.goToEdit,
            }}
        />
    );
}
