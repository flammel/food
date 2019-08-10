import React, { useRef } from "react";
import { emptyFood, Food, Brand } from "./Data";
import { isUnit, formatQuantity, formatNutritionValue, formatCalories } from "../Types";
import DataTable, { ItemSetter, DataTableColumn } from "../DataTable/DataTable";
import Fuse from "fuse.js";
import ComboBox from "../ComboBox/ComboBox";

interface FoodsTableProps {
    foods: Food[];
    brands: Brand[];
    onCreate: (newItem: Food) => void;
    onUpdate: (newItem: Food) => void;
    onDelete: (item: Food) => void;
    onUndoDelete: (item: Food) => void;
}

function search(brands: Brand[], search: string | null): Brand[] {
    // Fuse needs an array of objects, but the brands parameter is an array
    // of strings. So we first transform to an array of objects and
    // in the return statement extract the brand name.
    const fuse = new Fuse(brands.map((brand) => ({ brand })), {
        keys: ["brand"],
    });
    const result = fuse.search(search);
    return result.map((brand) => brand.brand);
}

export default function FoodsTable(props: FoodsTableProps) {
    const nameInput = useRef<HTMLInputElement>();
    const onChange = (setFood: ItemSetter<Food>, newField: Partial<Food>) =>
        setFood((prev) => ({ ...prev, ...newField }));

    const columns: Array<DataTableColumn<Food>> = [
        {
            id: "food",
            label: "Food",
            value: (f: Food) => f.name,
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        onChange={(e) => onChange(setItem, { name: e.target.value })}
                        value={f.name}
                        ref={nameInput}
                        autoFocus
                    />
                </div>
            ),
        },
        {
            id: "brand",
            label: "Brand",
            value: (f: Food) => f.brand,
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <ComboBox
                    items={props.brands}
                    onSelect={(brand) => onChange(setItem, { brand })}
                    onChange={(brand) => onChange(setItem, { brand })}
                    selected={f.brand}
                    placeholder="Brand"
                    itemLabel={(brand) => brand}
                    itemKey={(brand) => brand}
                    search={search}
                />
            ),
        },
        {
            id: "quantity",
            label: "Quantity",
            value: (f: Food) => formatQuantity(f.quantity) + " " + f.unit,
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Quantity"
                        onChange={(e) =>
                            parseInt(e.target.value) > 0
                                ? onChange(setItem, { quantity: parseInt(e.target.value) })
                                : null
                        }
                        value={f.quantity}
                    />
                    <div className="input-group-append">
                        <select
                            className="form-control"
                            onChange={(e) =>
                                isUnit(e.target.value) ? onChange(setItem, { unit: e.target.value }) : null
                            }
                            value={f.unit}
                        >
                            <option>g</option>
                            <option>ml</option>
                        </select>
                    </div>
                </div>
            ),
        },
        {
            id: "calories",
            label: "Calories",
            value: (f: Food) => formatCalories(f.calories),
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Calories"
                        onChange={(e) =>
                            parseInt(e.target.value) > 0
                                ? onChange(setItem, { calories: parseInt(e.target.value) })
                                : null
                        }
                        value={f.calories}
                    />
                </div>
            ),
        },
        {
            id: "fat",
            label: "Fat",
            value: (f: Food) => formatNutritionValue(f.fat) + " g",
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Fat"
                        onChange={(e) =>
                            parseFloat(e.target.value) > 0
                                ? onChange(setItem, { fat: parseFloat(e.target.value) })
                                : null
                        }
                        value={f.fat}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            ),
        },
        {
            id: "carbs",
            label: "Carbs",
            value: (f: Food) => formatNutritionValue(f.carbs) + " g",
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Carbs"
                        onChange={(e) =>
                            parseFloat(e.target.value) > 0
                                ? onChange(setItem, { carbs: parseFloat(e.target.value) })
                                : null
                        }
                        value={f.carbs}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            ),
        },
        {
            id: "protein",
            label: "Protein",
            value: (f: Food) => formatNutritionValue(f.protein) + " g",
            form: (f: Food, setItem: ItemSetter<Food>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="form-control"
                        placeholder="Protein"
                        onChange={(e) =>
                            parseFloat(e.target.value) > 0
                                ? onChange(setItem, { protein: parseFloat(e.target.value) })
                                : null
                        }
                        value={f.protein}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">g</div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            className={"foods-table"}
            items={props.foods}
            emptyItem={emptyFood}
            idGetter={(item: Food) => item.id + ""}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onDelete}
        />
    );
}
