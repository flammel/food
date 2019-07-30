import React, { useState, useRef, useEffect } from "react";

interface DataTableColumn<ItemType> {
    id: string;
    label: string;
    renderer: (item: ItemType) => string;
}

type ItemId = string;

interface DataTableProps<ItemType> {
    columns: DataTableColumn<ItemType>[];
    items: ItemType[];
    emptyItem: ItemType;
    idGetter: (item: ItemType) => ItemId;
    onCreate: (newItem: ItemType) => void;
    onUpdate: (newItem: ItemType, oldItem: ItemType) => void;
    onDelete: (item: ItemType) => void;
}

interface DataTableRowProps<ItemType> {
    columns: DataTableColumn<ItemType>[];
    item: ItemType;
    isForm: boolean;
    isEditing: boolean;
    onSave: (newItem: ItemType) => void;
    onDelete: () => void;
    onEditStart: () => void;
    onEditStop: () => void;
}

interface DataTableHeaderProps<ItemType> {
    columns: DataTableColumn<ItemType>[];
}

function DataTableHeader<ItemType>(props: DataTableHeaderProps<ItemType>) {
    return (
        <div className="data-table__row">
            {props.columns.map(column => (
                <div className={"data-table__cell data-table__cell--header data-table__cell--" + column.id}>{column.label}</div>
            ))}
            <div className="data-table__cell data-table__cell--header data-table__cell--actions"></div>
        </div>
    );
}

function DataTableRow<ItemType>(props: DataTableRowProps<ItemType>) {
    const [isHovering, setHovering] = useState(false);
    return (
        <div
            className={"data-table__row" + (isHovering ? " data-table__row--hovered" : "")}
            onDoubleClick={props.onEditStart}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            {props.columns.map((column) => (
                <div className={"data-table__cell data-table__cell--" + column.id}>
                    <span className="data-table__value">{column.renderer(props.item)}</span>
                </div>
            ))}
            <div className="data-table__cell data-table__cell--actions">
                <div className="button-group">
                    <button className="btn btn-info flex-larger" onClick={props.onEditStart}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={props.onDelete}>
                        Delete
                    </button>
                </div>
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
        <div className="data-table">
            <DataTableHeader columns={props.columns} />
            <DataTableRow
                columns={props.columns}
                item={props.emptyItem}
                isForm={true}
                isEditing={false}
                onSave={props.onCreate}
                onEditStart={() => {}}
                onEditStop={() => {}}
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
                    onEditStop={() => setEditing(null)}
                />
            ))}
        </div>
    );
}
