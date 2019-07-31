import React from "react";
import { Consumption, consumptionLabel } from "./Data";
import { Food } from "../Foods/Data";
import { formatQuantity, formatNutritionValue, formatCalories } from "../Types";
import DataTable, { DataTableColumn, ItemSetter } from "../DataTable/DataTable";
import FoodCombo from "../FoodCombo/FoodCombo";
import { withFood, withQuantity } from "../QuantifiedsFood/Data";

interface ConsumptionsTableProps {
    consumptions: Consumption[];
    foods: Food[];
    emptyConsumption: Consumption;
    onCreate: (newItem: Consumption) => void;
    onUpdate: (newItem: Consumption) => void;
    onDelete: (item: Consumption) => void;
    onUndoDelete: (item: Consumption) => void;
}

interface ConsumptionsTableSumsProps {
    consumptions: Consumption[];
}

function ConsumptionsTableSums(props: ConsumptionsTableSumsProps) {
    let calories = 0;
    let fat = 0.0;
    let carbs = 0.0;
    let protein = 0.0;
    for (const consumption of props.consumptions) {
        calories += consumption.calories;
        fat += consumption.fat;
        carbs += consumption.carbs;
        protein += consumption.protein;
    }
    return (
        <div className="data-table__row">
            <div className="data-table__cell data-table__cell--food consumptions-table__cell--sums"></div>
            <div className="data-table__cell data-table__cell--quantity consumptions-table__cell--sums"></div>
            <div className="data-table__cell data-table__cell--calories consumptions-table__cell--sums">
                {formatCalories(calories)}
            </div>
            <div className="data-table__cell data-table__cell--fat consumptions-table__cell--sums">
                {formatNutritionValue(fat)} g
            </div>
            <div className="data-table__cell data-table__cell--carbs consumptions-table__cell--sums">
                {formatNutritionValue(carbs)} g
            </div>
            <div className="data-table__cell data-table__cell--protein consumptions-table__cell--sums">
                {formatNutritionValue(protein)} g
            </div>
            <div className="data-table__cell data-table__cell--actions consumptions-table__cell--sums"></div>
        </div>
    );
}

export default function ConsumptionsTable(props: ConsumptionsTableProps) {
    const onFoodSelect = (setItem: ItemSetter<Consumption>) => (selection: Food) => {
        setItem((prev) => withFood(prev, selection));
    };

    const onQuantityChange = (setItem: ItemSetter<Consumption>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 0) {
            setItem((prev) => withQuantity(prev, quantity));
        }
    };

    const columns: Array<DataTableColumn<Consumption>> = [
        {
            id: "food",
            label: "Food",
            value: consumptionLabel,
            form: (c: Consumption, setItem: ItemSetter<Consumption>) => (
                <FoodCombo
                    foods={props.foods}
                    onFoodSelect={onFoodSelect(setItem)}
                    selectedFood={c.food}
                />
            ),
        },
        {
            id: "quantity",
            label: "Quantity",
            value: (c: Consumption) => formatQuantity(c.quantity) + " " + c.food.unit,
            form: (c: Consumption, setItem: ItemSetter<Consumption>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Quantity"
                        value={formatQuantity(c.quantity)}
                        onChange={onQuantityChange(setItem)}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">{c.food.unit}</div>
                    </div>
                </div>
            ),
        },
        {
            id: "calories",
            label: "Calories",
            value: (c: Consumption) => formatCalories(c.calories),
        },
        {
            id: "fat",
            label: "Fat",
            value: (c: Consumption) => formatNutritionValue(c.fat) + " g",
        },
        {
            id: "carbs",
            label: "Carbs",
            value: (c: Consumption) => formatNutritionValue(c.carbs) + " g",
        },
        {
            id: "protein",
            label: "Protein",
            value: (c: Consumption) => formatNutritionValue(c.protein) + " g",
        },
    ];
    return (
        <DataTable
            columns={columns}
            className={"consumptions-table"}
            items={props.consumptions}
            emptyItem={props.emptyConsumption}
            idGetter={(item: Consumption) => item.id + ""}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            append={<ConsumptionsTableSums consumptions={props.consumptions} />}
        />
    );
}
