import React from "react";
import { Ingredient, ingredientNutritionData } from "./Data";
import { Food, foodLabel } from "../Foods/Data";
import { formatCalories, formatNutritionValue, formatQuantity } from "../Types";
import DataTable, { ItemSetter, ColumnDefinition } from "../DataTable/DataTable";
import ComboBox from "../ComboBox/ComboBox";
import Fuse from "fuse.js";

interface IngredientsTableProps {
    ingredients: Ingredient[];
    foods: Food[];
    emptyItem: Ingredient;
    onCreate: (ingredient: Ingredient) => void;
    onUpdate: (ingredient: Ingredient) => void;
    onDelete: (ingredient: Ingredient) => void;
    onUndoDelete: (ingredient: Ingredient) => void;
    footer: React.ReactElement;
}

function search(foods: Food[], search: string): Food[] {
    const fuse = new Fuse(foods, {
        keys: ["name", "brand"],
    });
    const result = fuse.search(search);
    return result;
}

function onSelect(setItem: ItemSetter<Ingredient>): (food: Food) => void {
    return (food) => setItem((prev) => ({ ...prev, food }));
}

function onQuantityChange(setItem: ItemSetter<Ingredient>): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 0) {
            setItem((prev) => ({ ...prev, quantity }));
        }
    };
}

export default function IngredientsTable(props: IngredientsTableProps): React.ReactElement {
    const columns: ColumnDefinition<Ingredient> = [
        {
            id: "food",
            label: "Ingredients",
            value: (item: Ingredient) => foodLabel(item.food),
            form: (item: Ingredient, setItem: ItemSetter<Ingredient>) => (
                <ComboBox
                    items={props.foods}
                    onSelect={onSelect(setItem)}
                    selected={item.food}
                    placeholder="Food"
                    itemLabel={(food) => foodLabel(food)}
                    itemKey={(food) => food.id.toString()}
                    search={search}
                />
            ),
        },
        {
            id: "quantity",
            label: "Quantity",
            value: (item: Ingredient) => formatQuantity(item.quantity) + " " + item.food.unit,
            form: (item: Ingredient, setItem: ItemSetter<Ingredient>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Quantity"
                        value={formatQuantity(item.quantity)}
                        onChange={onQuantityChange(setItem)}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">{item.food.unit}</div>
                    </div>
                </div>
            ),
        },
        {
            id: "calories",
            label: "",
            value: (item: Ingredient) => formatCalories(ingredientNutritionData(item).calories),
        },
        {
            id: "fat",
            label: "",
            value: (item: Ingredient) => formatNutritionValue(ingredientNutritionData(item).fat) + " g",
        },
        {
            id: "carbs",
            label: "",
            value: (item: Ingredient) => formatNutritionValue(ingredientNutritionData(item).carbs) + " g",
        },
        {
            id: "protein",
            label: "",
            value: (item: Ingredient) => formatNutritionValue(ingredientNutritionData(item).protein) + " g",
        },
    ];
    return (
        <DataTable
            columns={columns}
            className={"ingredients-table"}
            items={props.ingredients}
            emptyItem={props.emptyItem}
            idGetter={(ingredient) => ingredient.id.toString()}
            labelGetter={(ingredient) => foodLabel(ingredient.food)}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            rows={{ first: props.footer }}
            createButtonLabel="Add"
        />
    );
}
