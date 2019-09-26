import React, { MutableRefObject } from "react";
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
    inputRef?: MutableRefObject<HTMLInputElement | null>;
}

export default function ComboBox<ItemType>(props: ComboBoxProps<ItemType>): React.ReactElement {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    };

    const onSelectChange = (item: ItemType | null): void => {
        if (item !== null) {
            props.onSelect(item);
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
            selectedItem={props.selected}
        >
            {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem }) => (
                <div className="input-group input-group--combo" data-foo={JSON.stringify(selectedItem)}>
                    <input
                        {...getInputProps({
                            type: "text",
                            className: "form-control",
                            placeholder: props.placeholder,
                            onChange: onInputChange,
                            autoFocus: props.autoFocus,
                            ref: props.inputRef
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
