import React, { useState, useRef, useEffect } from "react";
import { Food, FoodId, emptyFood } from "./Data";
import { isUnit, formatQuantity, formatNutritionValue, formatCalories } from "../Types";

interface FoodsTableProps {
    foods: Food[];
    onSave: (newFood: Food, oldFood?: Food) => void;
    onDelete: (food: Food) => void;
}

interface FoodsTableRowProps {
    food: Food;
    form: boolean;
    isEditing: boolean;
    onSave: (newFood: Food) => void;
    onEditStart: () => void;
    onEditStop: () => void;
    onDelete: () => void;
}

function FoodsTableHeader() {
    return (
        <div className="foods-table__row foods-table__row--form">
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--name">Food</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--brand">Brand</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--quantity">Quantity</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--calories">Calories</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--fat">Fat</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--carbs">Carbs</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--protein">Protein</div>
            <div className="foods-table__cell foods-table__cell--header foods-table__cell--actions"></div>
        </div>
    );
}

function FoodsTableRow(props: FoodsTableRowProps) {
    if (props.form) {
        return <FoodsTableFormRow {...props} />;
    } else {
        return <FoodsTableDataRow {...props} />;
    }
}

function FoodsTableDataRow(props: FoodsTableRowProps) {
    const [isHovering, setHovering] = useState(false);
    return (
        <div
            className={"foods-table__row" + (isHovering ? " foods-table__row--hovered" : "")}
            onDoubleClick={props.onEditStart}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            <div className="foods-table__cell foods-table__cell--name">
                <span className="foods-table__value">{props.food.name}</span>
            </div>
            <div className="foods-table__cell foods-table__cell--brand">
                <span className="foods-table__value">{props.food.brand}</span>
            </div>
            <div className="foods-table__cell foods-table__cell--quantity">
                <span className="foods-table__value">
                    {formatQuantity(props.food.quantity)} {props.food.unit}
                </span>
            </div>
            <div className="foods-table__cell foods-table__cell--calories">
                <span className="foods-table__value">{formatCalories(props.food.calories)}</span>
            </div>
            <div className="foods-table__cell foods-table__cell--fat">
                <span className="foods-table__value">{formatNutritionValue(props.food.fat)} g</span>
            </div>
            <div className="foods-table__cell foods-table__cell--carbs">
                <span className="foods-table__value">{formatNutritionValue(props.food.carbs)} g</span>
            </div>
            <div className="foods-table__cell foods-table__cell--protein">
                <span className="foods-table__value">{formatNutritionValue(props.food.protein)} g</span>
            </div>
            <div className="foods-table__cell foods-table__cell--actions">
                <div className="button-group">
                    <button className="btn btn-info flex-larger" onClick={props.onEditStart}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={props.onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function FoodsTableFormRow(props: FoodsTableRowProps) {
    const nameInput = useRef<HTMLInputElement>();
    const [food, setFood] = useState<Food>(props.food);
    const onChange = (newField: Partial<Food>) => setFood((prev) => ({ ...prev, ...newField }));
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSave(food);
        setFood(props.food);
        nameInput.current.focus();
    };

    const onEscape = (e: KeyboardEvent) => {
        if (e.keyCode === 27) {
            props.onEditStop();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", onEscape, false);
        return () => {
            document.removeEventListener("keydown", onEscape, false);
        };
    });

    return (
        <form
            className={
                "foods-table__row foods-table__row--form" + (props.isEditing ? " foods-table__row--editing" : "")
            }
            onSubmit={onSubmit}
        >
            <div className="foods-table__cell foods-table__cell--name">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        onChange={(e) => onChange({ name: e.target.value })}
                        value={food.name}
                        ref={nameInput}
                        autoFocus
                    />
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--brand">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Brand"
                        onChange={(e) => onChange({ brand: e.target.value })}
                        value={food.brand}
                    />
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--quantity">
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Quantity"
                        onChange={(e) => onChange({ quantity: parseInt(e.target.value) })}
                        value={food.quantity}
                    />
                    <div className="input-group-append">
                        <select
                            className="form-control"
                            onChange={(e) => (isUnit(e.target.value) ? onChange({ unit: e.target.value }) : null)}
                            value={food.unit}
                        >
                            <option>g</option>
                            <option>ml</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--calories">
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Calories"
                        onChange={(e) => onChange({ calories: parseFloat(e.target.value) })}
                        value={food.calories}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--fat">
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Fat"
                        onChange={(e) => onChange({ fat: parseFloat(e.target.value) })}
                        value={food.fat}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--carbs">
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Carbs"
                        onChange={(e) => onChange({ carbs: parseFloat(e.target.value) })}
                        value={food.carbs}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--protein">
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Protein"
                        onChange={(e) => onChange({ protein: parseFloat(e.target.value) })}
                        value={food.protein}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            </div>
            <div className="foods-table__cell foods-table__cell--actions">
                <div className="button-group">
                    <button className="btn btn-primary flex-larger" type="submit">
                        Save
                    </button>
                    <button className="btn btn-light btn--cancel" type="button" onClick={props.onEditStop}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function FoodsTable(props: FoodsTableProps) {
    const [editing, setEditing] = useState<FoodId>();
    const onSave = (oldFood?: Food) => {
        return (newFood: Food) => {
            props.onSave(newFood, oldFood);
            setEditing(null);
        };
    };
    const onDelete = (food: Food) => {
        props.onDelete(food);
        setEditing(null);
    };
    return (
        <div className="foods-table">
            <FoodsTableHeader />
            <FoodsTableRow
                onSave={onSave()}
                food={emptyFood}
                form={true}
                isEditing={false}
                onEditStart={() => {}}
                onEditStop={() => {}}
                onDelete={() => {}}
            />
            {props.foods.map((food) => (
                <FoodsTableRow
                    onSave={onSave(food)}
                    food={food}
                    key={food.id}
                    form={food.id === editing}
                    isEditing={food.id === editing}
                    onEditStart={() => setEditing(food.id)}
                    onEditStop={() => setEditing(null)}
                    onDelete={() => onDelete(food)}
                />
            ))}
        </div>
    );
}
