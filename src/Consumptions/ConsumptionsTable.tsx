import React, { useState, useRef } from "react";
import { Consumption, consumptionLabel, withFood, withQuantity } from "./Data";
import { emptyFood, Food } from "../Foods/Data";
import { formatQuantity, formatNutritionValue, formatCalories } from "../Types";
import DataTable, { DataTableColumn, ItemSetter } from "../DataTable/DataTable";
import FoodCombo from "./FoodCombo";

interface ConsumptionsTableProps {
    consumptions: Consumption[];
    foods: Food[];
    onSave: (newConsumption: Consumption, oldConsumption?: Consumption) => void;
}

interface ConsumptionsTableSumsProps {
    consumptions: Consumption[];
}

const emptyConsumption: Consumption = {
    id: 0,
    date: new Date(),
    food: emptyFood,
    quantity: 100,
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
};

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
    const foodInput = useRef<HTMLInputElement>();
    const quantityInput = useRef<HTMLInputElement>();
    const [foodInputValue, setFoodInputValue] = useState("");

    const onFoodSelect = (setItem: ItemSetter<Consumption>) => (selection: Food) => {
        setItem((prev) => withFood(prev, selection));
        quantityInput.current.focus();
    };

    const onQuantityChange = (setItem: ItemSetter<Consumption>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        setItem((prev) => withQuantity(prev, quantity));
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
                    foodInputRef={foodInput}
                    inputValue={foodInputValue}
                    setInputValue={setFoodInputValue}
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
                        ref={quantityInput}
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
    return <DataTable
        columns={columns}
        className={"consumptions-table"}
        items={props.consumptions}
        emptyItem={emptyConsumption}
        idGetter={(item: Consumption) => item.id + ""}
        onCreate={(newItem: Consumption) => props.onSave(newItem)}
        onUpdate={(newItem: Consumption, oldItem: Consumption) => props.onSave(newItem, oldItem)}
        onDelete={(item: Consumption) => {}}
        append={<ConsumptionsTableSums consumptions={props.consumptions} />}
    />;
}
