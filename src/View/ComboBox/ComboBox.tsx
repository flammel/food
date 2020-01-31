import React, { MutableRefObject, useState, useEffect } from "react";
import Downshift, { GetItemPropsOptions } from "downshift";
import { IconChevronDown, IconX } from "../Icons";

interface ComboBoxProps<ItemType> {
    onSelect: (item: ItemType | null) => void;
    onChange?: (value: string) => void;
    selected: ItemType;
    placeholder?: string;
    itemLabel: (item: ItemType) => string;
    itemKey: (item: ItemType) => string;
    search: (search: string) => Promise<ItemType[]>;
    autoFocus?: boolean;
    inputRef?: MutableRefObject<HTMLInputElement | null>;
    isInvalid?: boolean;
}

export default function ComboBox<ItemType>(props: ComboBoxProps<ItemType>): React.ReactElement {
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState<ItemType[]>([]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    };

    const onSelectChange = (item: ItemType | null): void => {
        props.onSelect(item);
    };

    useEffect(() => {
        const fetchItems = async (): Promise<void> => {
            const items = await props.search(searchTerm);
            setItems(items);
        };
        fetchItems();
    }, [searchTerm]);

    const comboItems = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getItemProps: (options: GetItemPropsOptions<ItemType>) => any,
        highlightedIndex: number | null,
        selectedItem: ItemType,
    ): React.ReactElement[] => {
        if (items.length === 0) {
            return [
                <li key="not-found" className="combo__item combo__item--empty">
                    No matching items found.
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
                            "combo__item",
                            highlightedIndex === index ? "combo__item--highlighted" : "",
                            selectedItem === item ? "combo__item--selected" : "",
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
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                highlightedIndex,
                selectedItem,
                getToggleButtonProps,
                clearSelection,
                selectItem,
            }) => (
                <div className="combo">
                    <div className="combo__inner">
                        <input
                            {...getInputProps({
                                type: "text",
                                className:
                                    "input-group__input combo__input" +
                                    (props.isInvalid ? " form-control__invalid" : ""),
                                placeholder: props.placeholder || "",
                                onChange: onInputChange,
                                autoFocus: props.autoFocus,
                                ref: props.inputRef,
                            })}
                        />
                        {selectedItem && props.itemLabel(selectedItem) !== "" ? (
                            <button
                                className="combo__button"
                                onClick={() => {
                                    clearSelection();
                                    selectItem(null);
                                }}
                                type="button"
                            >
                                <IconX className="combo__icon" />
                            </button>
                        ) : (
                            <button className="combo__button" {...getToggleButtonProps()} type="button">
                                <IconChevronDown className="combo__icon" />
                            </button>
                        )}
                    </div>
                    {isOpen ? (
                        <ul {...getMenuProps({ className: "combo__list" })}>
                            {comboItems(getItemProps, highlightedIndex, selectedItem)}
                        </ul>
                    ) : null}
                </div>
            )}
        </Downshift>
    );
}
