import React from "react";
import {
    Consumption,
    Consumable,
    consumableUnit,
    consumableLabel,
    nutritionData,
    consumableIsFood,
    formatCalories,
    formatNutritionValue,
} from "./Data";
import { Quantity, formatQuantity } from "../Types";
import DataTable, { ItemSetter, ColumnDefinition } from "../DataTable/DataTable";
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

function search(consumables: Consumable[], search: string): Consumable[] {
    const fuse = new Fuse(consumables, {
        keys: ["name", "brand"],
    });
    const result = fuse.search(search);
    return result;
}

function consumableServingSize(consumable: Consumable): Quantity {
    if (consumableIsFood(consumable) && consumable.servingSize > 0) {
        return consumable.servingSize;
    } else {
        return 100;
    }
}

function consumptionIsNew(consumption: Consumption): boolean {
    return consumption.id === 0;
}

function onSelect(setItem: ItemSetter<Consumption>) {
    return (consumable: Consumable) =>
        setItem((prev) => ({
            ...prev,
            consumable,
            quantity: consumptionIsNew(prev) ? consumableServingSize(consumable) : prev.quantity,
        }));
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
    const columns: ColumnDefinition<Consumption> = [
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
            label: "Calories (kcal)",
            value: (consumption: Consumption) => formatCalories(nutritionData(consumption).calories),
        },
        {
            id: "fat",
            label: "Fat (g)",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).fat),
        },
        {
            id: "carbs",
            label: "Carbs (g)",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).carbs),
        },
        {
            id: "protein",
            label: "Protein (g)",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).protein),
        },
    ];
    return (
        <DataTable
            columns={columns}
            className={"consumptions-table"}
            items={props.consumptions}
            emptyItem={props.emptyItem}
            idGetter={(consumption) => consumption.id.toString()}
            labelGetter={(consumption) => consumableLabel(consumption.consumable)}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            rows={{ footer: <ConsumptionsTableSumsRow consumptions={props.consumptions} /> }}
        />
    );
}
