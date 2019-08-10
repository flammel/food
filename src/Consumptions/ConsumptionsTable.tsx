import React from "react";
import { Consumption, Consumable, consumableUnit, consumableLabel, nutritionData } from "./Data";
import { formatCalories, formatNutritionValue, formatQuantity } from "../Types";
import DataTable, { DataTableColumn, ItemSetter } from "../DataTable/DataTable";
import ComboBox from "../ComboBox/ComboBox";
import Fuse from "fuse.js";
import ConsumptionsTableSumsRow from "./ConsumptionsTableSumsRow";

interface ConsumptionsTableProps {
    consumptions: Consumption[];
    consumables: Consumable[];
    emptyItem: Consumption;
    onCreate: (consumption: Consumption) => void;
    onUpdate: (consumption: Consumption) => void;
    onDelete: (consumption: Consumption) => void;
    onUndoDelete: (consumption: Consumption) => void;
}

function search(consumables: Consumable[], search: string | null): Consumable[] {
    const fuse = new Fuse(consumables, {
        keys: ["name", "brand"],
    });
    const result = fuse.search(search);
    return result;
}

function onSelect(setItem: ItemSetter<Consumption>) {
    return (consumable: Consumable) => setItem((prev) => ({ ...prev, consumable }));
}

function onQuantityChange(setItem: ItemSetter<Consumption>) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 0) {
            setItem((prev) => ({ ...prev, quantity }));
        }
    };
}

export default function ConsumptionsTable(props: ConsumptionsTableProps) {
    const columns: Array<DataTableColumn<Consumption>> = [
        {
            id: "consumable",
            label: "Food or Recipe",
            value: (consumption: Consumption) => consumableLabel(consumption.consumable),
            form: (consumption: Consumption, setItem: ItemSetter<Consumption>) => (
                <ComboBox
                    items={props.consumables}
                    onSelect={onSelect(setItem)}
                    selected={consumption.consumable}
                    placeholder="Food or Recipe"
                    itemLabel={(consumable) => consumableLabel(consumable)}
                    itemKey={(consumable) => consumable.id.toString()}
                    search={search}
                    autoFocus={true}
                />
            ),
        },
        {
            id: "quantity",
            label: "Quantity",
            value: (consumption: Consumption) =>
                formatQuantity(consumption.quantity) + " " + consumableUnit(consumption.consumable),
            form: (consumption: Consumption, setItem: ItemSetter<Consumption>) => (
                <div className="input-group">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        className="form-control"
                        placeholder="Quantity"
                        value={formatQuantity(consumption.quantity)}
                        onChange={onQuantityChange(setItem)}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">{consumableUnit(consumption.consumable)}</div>
                    </div>
                </div>
            ),
        },
        {
            id: "calories",
            label: "Calories",
            value: (consumption: Consumption) => formatCalories(nutritionData(consumption).calories),
        },
        {
            id: "fat",
            label: "Fat",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).fat) + " g",
        },
        {
            id: "carbs",
            label: "Carbs",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).carbs) + " g",
        },
        {
            id: "protein",
            label: "Protein",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).protein) + " g",
        },
    ];
    return (
        <DataTable
            columns={columns}
            className={"consumptions-table"}
            items={props.consumptions}
            emptyItem={props.emptyItem}
            idGetter={(consumption) => consumption.id.toString()}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            additionalRows={{
                last: <ConsumptionsTableSumsRow consumptions={props.consumptions} />,
            }}
        />
    );
}
