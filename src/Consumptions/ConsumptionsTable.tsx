import React, { useState, useRef } from "react";
import Downshift, { GetItemPropsOptions } from "downshift";
import { Consumption, ConsumptionId, consumptionLabel, consumptionDateString, withFood, withQuantity } from "./Data";
import { emptyFood, foodSearch, foodLabel, Food } from "../Foods/Data";
import { formatQuantity, formatNutritionValue, formatCalories } from "../Types";

interface ConsumptionsTableProps {
    consumptions: Consumption[];
    foods: Food[];
    onSave: (newConsumption: Consumption, oldConsumption?: Consumption) => void;
}

interface ConsumptionsTableSumsProps {
    consumptions: Consumption[];
}

interface ConsumptionsTableRowProps {
    consumption: Consumption;
    foods: Food[];
    onSave: (newConsumption: Consumption) => void;
    form: boolean;
    onEditStart?: () => void;
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

function ConsumptionsTableHeader() {
    return (
        <div className="consumptions-table__row">
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--food">
                Food
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--quantity">
                Quantity
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--calories">
                Calories
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--fat">
                Fat
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--carbs">
                Carbs
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--protein">
                Protein
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--header consumptions-table__cell--actions"></div>
        </div>
    );
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
        <div className="consumptions-table__row">
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--food">
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--quantity">
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--calories">
                {formatCalories(calories)}
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--fat">
                {formatNutritionValue(fat)} g
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--carbs">
                {formatNutritionValue(carbs)} g
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--protein">
                {formatNutritionValue(protein)} g
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--sums consumptions-table__cell--actions"></div>
        </div>
    );
}

function ConsumptionsTableRow(props: ConsumptionsTableRowProps) {
    if (props.form) {
        return <ConsumptionsTableFormRow {...props} />;
    } else {
        return <ConsumptionsTableDataRow {...props} />;
    }
}

function ConsumptionsTableDataRow(props: ConsumptionsTableRowProps) {
    return (
        <div className="consumptions-table__row" onDoubleClick={props.onEditStart}>
            <div className="consumptions-table__cell consumptions-table__cell--food">
                <span className="consumptions-table__value">{consumptionLabel(props.consumption)}</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--quantity">
                <span className="consumptions-table__value">
                    {formatQuantity(props.consumption.quantity)} {props.consumption.food.unit}
                </span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--calories">
                <span className="consumptions-table__value">{formatCalories(props.consumption.calories)}</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--fat">
                <span className="consumptions-table__value">{formatNutritionValue(props.consumption.fat)} g</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--carbs">
                <span className="consumptions-table__value">{formatNutritionValue(props.consumption.carbs)} g</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--protein">
                <span className="consumptions-table__value">{formatNutritionValue(props.consumption.protein)} g</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--actions"></div>
        </div>
    );
}

interface FoodComboProps {
    foods: Food[];
    onFoodSelect: (food: Food) => void;
    foodInputRef: React.MutableRefObject<HTMLInputElement>;
    inputValue: string;
    setInputValue: (value: string) => void;
}

function FoodCombo(props: FoodComboProps) {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setInputValue(e.target.value);
    }

    const onSelectChange = (item: Food | null) => {
        if (item !== null) {
            props.onFoodSelect(item);
            props.setInputValue(foodLabel(item));
        } else {
            props.setInputValue("");
        }
    }

    const comboItems = (
        inputValue: string | null,
        getItemProps: (options: GetItemPropsOptions<Food>) => any,
        highlightedIndex: number | null,
        selectedItem: Food,
    ) => {
        const items = foodSearch(props.foods, inputValue);
        if (items.length === 0) {
            return <li className="combo--item">No matching food found.</li>;
        } else {
            return items.map((item, index) => (
                <li
                    {...getItemProps({
                        key: item.id,
                        index,
                        item,
                        className: [
                            "combo--item",
                            highlightedIndex === index ? "combo--item__highlighted" : "",
                            selectedItem === item ? "combo--item__selected" : "",
                        ].join(" "),
                    })}
                >
                    {foodLabel(item)}
                </li>
            ));
        }
    };

    return (
        <Downshift onChange={onSelectChange} itemToString={(item) => (item ? foodLabel(item) : "")} inputValue={props.inputValue}>
            {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem }) => (
                <div className="input-group input-group--combo">
                    <input
                        {...getInputProps({
                            type: "text",
                            className: "form-control",
                            placeholder: "Food",
                            ref: props.foodInputRef,
                            autoFocus: true,
                            onChange: onInputChange
                        })}
                    />
                    {isOpen ? (
                        <ul {...getMenuProps({ className: "combo" })}>
                            {comboItems(inputValue, getItemProps, highlightedIndex, selectedItem)}
                        </ul>
                    ) : null}
                </div>
            )}
        </Downshift>
    );
}

function ConsumptionsTableFormRow(props: ConsumptionsTableRowProps) {
    const foodInput = useRef<HTMLInputElement>();
    const quantityInput = useRef<HTMLInputElement>();
    const [consumption, setConsumption] = useState<Consumption>(props.consumption);
    const [foodInputValue, setFoodInputValue] = useState("");
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSave(consumption);
        setConsumption(props.consumption);
        setFoodInputValue("");
        foodInput.current.focus();
    };

    const onFoodSelect = (selection: Food) => {
        setConsumption((prev) => withFood(prev, selection));
        quantityInput.current.focus();
    };

    const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        setConsumption((prev) => withQuantity(prev, quantity));
    };

    return (
        <form className="consumptions-table__row" onSubmit={onSubmit}>
            <div className="consumptions-table__cell consumptions-table__cell--name">
                <FoodCombo foods={props.foods} onFoodSelect={onFoodSelect} foodInputRef={foodInput} inputValue={foodInputValue} setInputValue={setFoodInputValue} />
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--quantity">
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Quantity"
                        value={formatQuantity(consumption.quantity)}
                        onChange={onQuantityChange}
                        ref={quantityInput}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">{consumption.food.unit}</div>
                    </div>
                </div>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--calories">
                <span className="consumptions-table__value">{formatCalories(consumption.calories)}</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--fat">
                <span className="consumptions-table__value">{formatNutritionValue(consumption.fat)} g</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--carbs">
                <span className="consumptions-table__value">{formatNutritionValue(consumption.carbs)} g</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--protein">
                <span className="consumptions-table__value">{formatNutritionValue(consumption.protein)} g</span>
            </div>
            <div className="consumptions-table__cell consumptions-table__cell--actions">
                <button className="btn btn-primary btn-block">Save</button>
            </div>
        </form>
    );
}

export default function ConsumptionsTable(props: ConsumptionsTableProps) {
    const [editing, setEditing] = useState<ConsumptionId>();
    const onSave = (oldConsumption?: Consumption) => {
        return (newConsumption: Consumption) => {
            props.onSave(newConsumption, oldConsumption);
            setEditing(null);
        };
    };
    return (
        <div className="consumptions-table">
            <ConsumptionsTableHeader />
            <ConsumptionsTableRow onSave={onSave()} consumption={emptyConsumption} form={true} foods={props.foods} />
            {props.consumptions.map((consumption) => (
                <ConsumptionsTableRow
                    onSave={onSave(consumption)}
                    consumption={consumption}
                    key={consumption.id}
                    form={consumption.id === editing}
                    onEditStart={() => setEditing(consumption.id)}
                    foods={props.foods}
                />
            ))}
            <ConsumptionsTableSums consumptions={props.consumptions} />
        </div>
    );
}
