import React, { useRef, useState } from "react";
import Fuse from "fuse.js";
import { Consumption, consumableLabel, nutritionData, formatCalories, formatNutritionValue } from "../Data";
import DataTable, { ItemSetter, ColumnDefinition, BaseTableProps, TableEventHandler } from "../../DataTable/DataTable";
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
    const [invalidConsumable, setInvalidConsumable] = useState<string | null>(null);
    const [invalidQuantity, setInvalidQuantity] = useState<string | null>(null);

    const validating = (fn: TableEventHandler<Consumption>): TableEventHandler<Consumption> => {
        return (item: Consumption) =>
            new Promise((res, rej) => {
                let valid = true;
                if (item.consumable.id === nilUUID) {
                    setInvalidConsumable(item.id);
                    valid = false;
                } else {
                    setInvalidConsumable(null);
                }
                if (item.quantity < 1 || isNaN(item.quantity)) {
                    setInvalidQuantity(item.id);
                    valid = false;
                } else {
                    setInvalidQuantity(null);
                }
                if (valid) {
                    fn(item)
                        .then(res)
                        .catch(rej);
                } else {
                    rej();
                }
            });
    };

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
                    inputRef={consumableInputRef}
                    isInvalid={invalidConsumable === consumption.id}
                />
            ),
        },
        ConsumableQuantityInput(
            (consumption: Consumption) => consumption.consumable,
            (consumption: Consumption) => invalidQuantity === consumption.id,
        ),
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
            onCreate={validating(props.onCreate)}
            onUpdate={validating(props.onUpdate)}
            onDelete={props.onDelete}
            onUndoDelete={props.onUndoDelete}
            rows={{ footer: <ConsumptionsTableTotals consumptions={props.consumptions} settings={props.settings} /> }}
        />
    );
}
