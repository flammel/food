import React, { useState, useRef, useEffect } from "react";

export type ItemSetter<ItemType> = React.Dispatch<React.SetStateAction<ItemType>>;
export type ColumnForm<ItemType> = (item: ItemType, setItem: ItemSetter<ItemType>) => React.ReactElement;

export interface DataTableColumn<ItemType> {
    id: string;
    label: string;
    value: (item: ItemType) => string;
    form?: ColumnForm<ItemType>;
}

type ItemId = string;

interface DataTableProps<ItemType> {
    className: string;
    columns: DataTableColumn<ItemType>[];
    items: ItemType[];
    emptyItem: ItemType;
    idGetter: (item: ItemType) => ItemId;
    onCreate: (newItem: ItemType) => void;
    onUpdate: (newItem: ItemType, oldItem: ItemType) => void;
    onDelete: (item: ItemType) => void;
    append?: React.ReactElement
}

interface DataTableRowProps<ItemType> {
    columns: DataTableColumn<ItemType>[];
    item: ItemType;
    isForm: boolean;
    isEditing: boolean;
    onSave: (newItem: ItemType) => void;
    onDelete: () => void;
    onEditStart: () => void;
    onCancel: () => void;
}

interface DataTableHeaderProps<ItemType> {
    columns: DataTableColumn<ItemType>[];
}

function DataTableHeader<ItemType>(props: DataTableHeaderProps<ItemType>) {
    return (
        <div className="data-table__row">
            {props.columns.map((column) => (
                <div
                    key={column.id}
                    className={"data-table__cell data-table__cell--header data-table__cell--" + column.id}
                >
                    {column.label}
                </div>
            ))}
            <div className="data-table__cell data-table__cell--header data-table__cell--actions"></div>
        </div>
    );
}
function DataTableRow<ItemType>(props: DataTableRowProps<ItemType>) {
    if (props.isForm) {
        return <DataTableFormRow {...props} />;
    } else {
        return <DataTableNormalRow {...props} />;
    }
}

function DataTableFormRow<ItemType>(props: DataTableRowProps<ItemType>) {
    const [item, setItem] = useState<ItemType>(props.item);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSave(item);
        setItem(props.item);
    };
    return (
        <form
            className={"data-table__row data-table__row--form" + (props.isEditing ? " data-table__row--editing" : "")}
            onSubmit={onSubmit}
        >
            {props.columns.map((column) => (
                <div key={column.id} className={"data-table__cell data-table__cell--" + column.id}>
                    <span className="data-table__value">
                        {column.form ? column.form(item, setItem) : column.value(item)}
                    </span>
                </div>
            ))}
            <div className="data-table__cell data-table__cell--actions">
                <button className="btn btn-primary btn--larger" type="submit">
                    Save
                </button>
                <button className="btn btn-light btn--cancel" type="button" onClick={props.onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

function DataTableNormalRow<ItemType>(props: DataTableRowProps<ItemType>) {
    const [isHovering, setHovering] = useState(false);
    return (
        <div
            className={"data-table__row" + (isHovering ? " data-table__row--hovered" : "")}
            onDoubleClick={props.onEditStart}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            {props.columns.map((column) => (
                <div key={column.id} className={"data-table__cell data-table__cell--" + column.id}>
                    <span className="data-table__value">{column.value(props.item)}</span>
                </div>
            ))}
            <div className="data-table__cell data-table__cell--actions">
                <button className="btn btn-info btn--larger" onClick={props.onEditStart}>
                    Edit
                </button>
                <button className="btn btn-danger" onClick={props.onDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function DataTable<ItemType>(props: DataTableProps<ItemType>) {
    const [editing, setEditing] = useState<ItemId>();
    const onUpdate = (oldItem: ItemType) => {
        return (newItem: ItemType) => {
            props.onUpdate(newItem, oldItem);
            setEditing(null);
        };
    };
    const onDelete = (item: ItemType) => {
        props.onDelete(item);
        setEditing(null);
    };
    return (
        <div className={"data-table " + props.className}>
            <DataTableHeader columns={props.columns} />
            <DataTableRow
                columns={props.columns}
                item={props.emptyItem}
                isForm={true}
                isEditing={false}
                onSave={props.onCreate}
                onEditStart={() => {}}
                onCancel={() => {}}
                onDelete={() => {}}
            />
            {props.items.map((item) => (
                <DataTableRow
                    columns={props.columns}
                    item={item}
                    key={props.idGetter(item)}
                    isForm={props.idGetter(item) === editing}
                    isEditing={props.idGetter(item) === editing}
                    onSave={onUpdate(item)}
                    onDelete={() => onDelete(item)}
                    onEditStart={() => setEditing(props.idGetter(item))}
                    onCancel={() => setEditing(null)}
                />
            ))}
            {props.append}
        </div>
    );
}
