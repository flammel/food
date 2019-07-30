import React from "react";
import Downshift, { GetItemPropsOptions } from "downshift";
import { foodSearch, foodLabel, Food } from "../Foods/Data";

interface FoodComboProps {
    foods: Food[];
    onFoodSelect: (food: Food) => void;
    foodInputRef: React.MutableRefObject<HTMLInputElement>;
    inputValue: string;
    setInputValue: (value: string) => void;
}

export default function FoodCombo(props: FoodComboProps) {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setInputValue(e.target.value);
    };

    const onSelectChange = (item: Food | null) => {
        if (item !== null) {
            props.onFoodSelect(item);
            props.setInputValue(foodLabel(item));
        } else {
            props.setInputValue("");
        }
    };

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
        <Downshift
            onChange={onSelectChange}
            itemToString={(item) => (item ? foodLabel(item) : "")}
            inputValue={props.inputValue}
        >
            {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem }) => (
                <div className="input-group input-group--combo">
                    <input
                        {...getInputProps({
                            type: "text",
                            className: "form-control",
                            placeholder: "Food",
                            ref: props.foodInputRef,
                            autoFocus: true,
                            onChange: onInputChange,
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
