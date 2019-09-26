import React, { useRef } from "react";
import Fuse from "fuse.js";
import { Consumption, consumableLabel, nutritionData, formatCalories, formatNutritionValue } from "../Data";
import DataTable, { ItemSetter, ColumnDefinition, BaseTableProps, ColumnId } from "../../DataTable/DataTable";
import ComboBox from "../../ComboBox/ComboBox";
import ConsumptionsTableTotals from "./ConsumptionsTableTotals";
import { Consumable, ConsumableQuantityInput } from "../../Consumable";
import { Settings } from "../../Settings/Data";
import { nilUUID } from "../../UUID";

interface ConsumptionsTableProps extends BaseTableProps<Consumption> {
    consumptions: Consumption[];
    consumables: Consumable[];
    settings: Settings;
}

function search(consumables: Consumable[], search: string): Consumable[] {
    const fuse = new Fuse(consumables, {
        keys: ["name", "brand"],
    });
    const result = fuse.search(search);
    return result;
}

function onSelect(setItem: ItemSetter<Consumption>): (c: Consumable) => void {
    return (consumable) =>
        setItem((prev) => ({
            ...prev,
            consumable,
        }));
}

export default function ConsumptionsTable(props: ConsumptionsTableProps): React.ReactElement {
    const consumableInputRef = useRef<HTMLInputElement>(null);

    const columns: ColumnDefinition<Consumption> = [
        {
            id: "consumable",
            label: "Food or Recipe",
            value: (consumption: Consumption) => consumableLabel(consumption.consumable),
            form: (consumption: Consumption, setItem: ItemSetter<Consumption>, isInvalid: boolean) => (
                <ComboBox
                    items={props.consumables}
                    onSelect={onSelect(setItem)}
                    selected={consumption.consumable}
                    placeholder="Food or Recipe"
                    itemLabel={(consumable) => consumableLabel(consumable)}
                    itemKey={(consumable) => consumable.id.toString()}
                    search={search}
                    autoFocus={true}
                    inputRef={consumableInputRef}
                    isInvalid={isInvalid}
                />
            ),
        },
        ConsumableQuantityInput((consumption: Consumption) => consumption.consumable),
        {
            id: "calories",
            label: "Calories",
            value: (consumption: Consumption) => formatCalories(nutritionData(consumption).calories),
        },
        {
            id: "fat",
            label: "Fat",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).fat),
        },
        {
            id: "carbs",
            label: "Carbs",
            value: (consumption: Consumption) => formatNutritionValue(nutritionData(consumption).carbs),
        },
        {
            id: "protein",
            label: "Protein",
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
            focusAfterCreateRef={consumableInputRef}
            onCreate={props.onCreate}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            rows={{ footer: <ConsumptionsTableTotals consumptions={props.consumptions} settings={props.settings} /> }}
            validator={(item: Consumption): Set<ColumnId> => {
                const invalidFields = new Set<ColumnId>();
                if (item.consumable.id === nilUUID) {
                    invalidFields.add("consumable");
                }
                if (item.quantity < 1 || isNaN(item.quantity)) {
                    invalidFields.add("quantity");
                }
                return invalidFields;
            }}
        />
    );
}
