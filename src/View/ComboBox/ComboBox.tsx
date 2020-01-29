import React, { MutableRefObject, useState, useEffect } from "react";
import Downshift, { GetItemPropsOptions } from "downshift";

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
                                <svg className="combo__icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
                                    ></path>
                                </svg>
                            </button>
                        ) : (
                            <button className="combo__button" {...getToggleButtonProps()} type="button">
                                <svg className="combo__icon" viewBox="0 0 10 16" version="1.1" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"></path>
                                </svg>
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
