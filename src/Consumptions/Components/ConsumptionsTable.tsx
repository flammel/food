import React, { useRef } from "react";
import { Consumption, consumableLabel, nutritionData, formatCalories, formatNutritionValue } from "../Data";
import DataTable, { ItemSetter, ColumnDefinition, BaseTableProps, ColumnId } from "../../DataTable/DataTable";
import ComboBox from "../../ComboBox/ComboBox";
import ConsumptionsTableTotals from "./ConsumptionsTableTotals";
import { Consumable, ConsumableQuantityInput } from "../../Consumable";
import { Settings } from "../../Settings/Data";
import { nilUUID } from "../../UUID";

interface ConsumptionsTableProps extends BaseTableProps<Consumption> {
    consumptions: Consumption[];
    settings: Settings;
    consumableSearch: (search: string) => Promise<Consumable[]>;
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
                    onSelect={onSelect(setItem)}
                    selected={consumption.consumable}
                    placeholder="Food or Recipe"
                    itemLabel={(consumable) => consumableLabel(consumable)}
                    itemKey={(consumable) => consumable.id.toString()}
                    search={props.consumableSearch}
                    autoFocus={true}
                    inputRef={consumableInputRef}
                    isInvalid={isInvalid}
                />
            ),
        },
        ConsumableQuantityInput((consumption: Consumption) => consumption.consumable),
        {
            group: "macros",
            columns: [
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
            ],
        }
    ];


    const caloriesSum = props.consumptions.reduce((acc, cur) => acc + nutritionData(cur).calories, 0);
    const carbsSum = props.consumptions.reduce((acc, cur) => acc + nutritionData(cur).carbs, 0);
    const fatSum = props.consumptions.reduce((acc, cur) => acc + nutritionData(cur).fat, 0);
    const proteinSum = props.consumptions.reduce((acc, cur) => acc + nutritionData(cur).protein, 0);
    const preHeader = 
    <div className="data-table__row data-table__row--show">
        <div className="data-table__group--macros">
            <div className="data-table__cell  data-table__cell--id-calories">
                <span className="data-table__value" data-label="Calories" data-suffix={"/" + props.settings.targetCalories}>{formatCalories(caloriesSum)}</span>
            </div>
            <div className="data-table__cell  data-table__cell--id-carbs">
                <span className="data-table__value" data-label="Carbs" data-suffix={"/" + props.settings.targetCarbs}>{formatNutritionValue(carbsSum)}</span>
            </div>
            <div className="data-table__cell  data-table__cell--id-fat">
                <span className="data-table__value" data-label="Fat" data-suffix={"/" + props.settings.targetFat}>{formatNutritionValue(fatSum)}</span>
            </div>
            <div className="data-table__cell  data-table__cell--id-protein">
                <span className="data-table__value" data-label="Protein" data-suffix={"/" + props.settings.targetProtein}>{formatNutritionValue(proteinSum)}</span>
            </div>
        </div>
    </div>;

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
            rows={{preHeader: preHeader}}
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
