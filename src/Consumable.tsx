import React from "react";
import { Column, ItemSetter } from "./DataTable/DataTable";
import { Food, formatServingSize } from "./Foods/Data";
import { Recipe } from "./Recipes/Data";
import { consumableIsFood, consumableUnit } from "./Consumptions/Data";
import { formatQuantity, Quantity } from "./Types";

export type Consumable = Food | Recipe;

const label = (consumable: Consumable): string => {
    // Does not use the actual quantity but instead 0 because
    // otherwise the label width changes when the user changes the quantity in the
    // input, which looks weird.
    if (consumableIsFood(consumable)) {
        return "× " + formatServingSize(consumable.servingSize) + " " + consumableUnit(consumable, 0);
    } else {
        return consumableUnit(consumable, 0);
    }
};

export function ConsumableQuantityInput<ItemType extends { quantity: Quantity }>(
    getConsumable: (item: ItemType) => Consumable,
): Column<ItemType> {
    return {
        id: "quantity",
        label: "Quantity",
        value: (item: ItemType) => {
            const consumable = getConsumable(item);
            if (consumableIsFood(consumable)) {
                return (
                    formatQuantity(item.quantity) +
                    " × " +
                    formatServingSize(consumable.servingSize) +
                    " " +
                    consumableUnit(consumable, item.quantity)
                );
            } else {
                return formatQuantity(item.quantity) + " " + consumableUnit(consumable, item.quantity);
            }
        },
        form: (item: ItemType, setItem: ItemSetter<ItemType>, isInvalid: boolean) => (
            <div className="input-group">
                <input
                    type="number"
                    min="0"
                    step="1"
                    className={"form-control" + (isInvalid ? " form-control__invalid" : "")}
                    placeholder="Quantity"
                    value={formatQuantity(item.quantity)}
                    onChange={(e) => {
                        const quantity = parseInt(e.target.value);
                        setItem((prev) => ({ ...prev, quantity }));
                    }}
                />
                <div className="input-group-append">
                    <div className="input-group-text">{label(getConsumable(item))}</div>
                </div>
            </div>
        ),
    };
}
