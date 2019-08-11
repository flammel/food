import React, { useState, useEffect } from "react";
import Downshift, { GetItemPropsOptions } from "downshift";

interface ComboBoxProps<ItemType> {
    items: ItemType[];
    onSelect: (item: ItemType) => void;
    onChange?: (value: string) => void;
    selected: ItemType;
    placeholder: string;
    itemLabel: (item: ItemType) => string;
    itemKey: (item: ItemType) => string;
    search: (items: ItemType[], search: string) => ItemType[];
    autoFocus?: boolean;
}

export default function ComboBox<ItemType>(props: ComboBoxProps<ItemType>): React.ReactElement {
    const [currentInputValue, setCurrentInputValue] = useState<string>(props.itemLabel(props.selected));

    useEffect(() => {
        setCurrentInputValue(props.itemLabel(props.selected));
    }, [props.itemKey(props.selected)]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCurrentInputValue(e.target.value);
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    };

    const onSelectChange = (item: ItemType | null): void => {
        if (item !== null) {
            props.onSelect(item);
            setCurrentInputValue(props.itemLabel(item));
        } else {
            setCurrentInputValue("");
        }
    };

    const comboItems = (
        inputValue: string | null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getItemProps: (options: GetItemPropsOptions<ItemType>) => any,
        highlightedIndex: number | null,
        selectedItem: ItemType,
    ): React.ReactElement[] => {
        const items = props.search(props.items, inputValue || "");
        if (items.length === 0) {
            return [
                <li key="not-found" className="combo--item">
                    No matching food found.
                </li>,
            ];
        } else {
            return items.map((item, index) => (
                <li
                    key={props.itemKey(item)}
                    {...getItemProps({
                        index,
                        item,
                        className: [
                            "combo--item",
                            highlightedIndex === index ? "combo--item__highlighted" : "",
                            selectedItem === item ? "combo--item__selected" : "",
                        ].join(" "),
                    })}
                >
                    {props.itemLabel(item)}
                </li>
            ));
        }
    };

    return (
        <Downshift
            onChange={onSelectChange}
            itemToString={(item) => (item ? props.itemLabel(item) : "")}
            inputValue={currentInputValue}
        >
            {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem }) => (
                <div className="input-group input-group--combo">
                    <input
                        {...getInputProps({
                            type: "text",
                            className: "form-control",
                            placeholder: props.placeholder,
                            onChange: onInputChange,
                            autoFocus: props.autoFocus,
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
