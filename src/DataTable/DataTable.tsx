import React, { useState, useEffect } from "react";

export type ItemSetter<ItemType> = React.Dispatch<React.SetStateAction<ItemType>>;
export type ColumnForm<ItemType> = (item: ItemType, setItem: ItemSetter<ItemType>) => React.ReactElement;

export interface DataTableColumn<ItemType> {
    id: string;
    label: string;
    value: (item: ItemType) => string;
    form?: ColumnForm<ItemType>;
}

type ItemId = string;

type RowType = "create" | "show" | "edit" | "undoableDelete";

interface AdditionalRows {
    first?: React.ReactElement;
    afterHeader?: React.ReactElement;
    last?: React.ReactElement;
}

interface DataTableProps<ItemType> {
    className: string;
    columns: DataTableColumn<ItemType>[];
    items: ItemType[];
    emptyItem: ItemType;
    idGetter: (item: ItemType) => ItemId;
    onCreate: (newItem: ItemType) => void;
    onUpdate: (newItem: ItemType) => void;
    onDelete: (item: ItemType) => void;
    onUndoDelete: (item: ItemType) => void;
    createForm?: React.ReactElement;
    additionalRows?: AdditionalRows;
    createButtonLabel?: string;
}

interface DataTableRowProps<ItemType> {
    columns: DataTableColumn<ItemType>[];
    item: ItemType;
    type: RowType;
    onSave: (newItem: ItemType) => void;
    onDelete: () => void;
    onEditStart: () => void;
    onCancel: () => void;
    createButtonLabel?: string;
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
    if (props.type === "create" || props.type === "edit") {
        return <DataTableFormRow {...props} />;
    } else if (props.type === "undoableDelete") {
        return <DataTableUndoableDeleteRow {...props} />;
    } else {
        return <DataTableShowRow {...props} />;
    }
}

function DataTableFormRow<ItemType>(props: DataTableRowProps<ItemType>) {
    const [item, setItem] = useState<ItemType>(props.item);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSave(item);
        setItem(props.item);
    };

    const onEscape = (e: KeyboardEvent) => {
        if (e.keyCode === 27) {
            props.onCancel();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", onEscape, false);
        return () => {
            document.removeEventListener("keydown", onEscape, false);
        };
    });

    return (
        <form className="data-table__row data-table__row--form" onSubmit={onSubmit}>
            {props.columns.map((column) => (
                <div key={column.id} className={"data-table__cell data-table__cell--" + column.id}>
                    <span className="data-table__value">
                        {column.form ? column.form(item, setItem) : column.value(item)}
                    </span>
                </div>
            ))}
            <div className="data-table__cell data-table__cell--actions">
                <button className="btn btn-primary action action--larger action--visible" type="submit">
                    {props.type === "create" && props.createButtonLabel ? props.createButtonLabel : "Save"}
                </button>
                {props.type === "create" ? null : (
                    <button
                        className="btn btn-light action action--cancel action--visible"
                        type="button"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
function DataTableUndoableDeleteRow<ItemType>(props: DataTableRowProps<ItemType>) {
    const [isHovering, setHovering] = useState(false);
    return (
        <div
            className="data-table__row"
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
                <button
                    className={"btn btn-info action action--larger" + (isHovering ? " action--visible" : "")}
                    onClick={props.onEditStart}
                >
                    Edit
                </button>
                <button
                    className={"btn btn-danger action" + (isHovering ? " action--visible" : "")}
                    onClick={props.onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

function DataTableShowRow<ItemType>(props: DataTableRowProps<ItemType>) {
    const [isHovering, setHovering] = useState(false);
    return (
        <div
            className="data-table__row"
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
                <button
                    className={"btn btn-info action action--larger" + (isHovering ? " action--visible" : "")}
                    onClick={props.onEditStart}
                >
                    Edit
                </button>
                <button
                    className={"btn btn-danger action" + (isHovering ? " action--visible" : "")}
                    onClick={props.onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function DataTable<ItemType>(props: DataTableProps<ItemType>) {
    const [editing, setEditing] = useState<ItemId>();
    const [undoableDelete, setUndoableDelete] = useState<ItemId>();
    const onUpdate = (item: ItemType) => {
        props.onUpdate(item);
        setEditing(null);
    };
    const onDelete = (item: ItemType) => {
        props.onDelete(item);
        setUndoableDelete(props.idGetter(item));
    };
    const additionalRows: AdditionalRows = { first: null, afterHeader: null, last: null, ...props.additionalRows };
    return (
        <div className={"data-table " + props.className}>
            {additionalRows.first}
            <DataTableHeader columns={props.columns} />
            {additionalRows.afterHeader}
            {props.createForm ? (
                props.createForm
            ) : (
                <DataTableRow
                    columns={props.columns}
                    item={props.emptyItem}
                    type="create"
                    onSave={props.onCreate}
                    onEditStart={() => {}}
                    onCancel={() => {}}
                    onDelete={() => {}}
                    createButtonLabel={props.createButtonLabel}
                />
            )}
            {props.items.map((item) => (
                <DataTableRow
                    columns={props.columns}
                    item={item}
                    key={props.idGetter(item)}
                    type={
                        props.idGetter(item) === editing
                            ? "edit"
                            : props.idGetter(item) === undoableDelete
                            ? "undoableDelete"
                            : "show"
                    }
                    onSave={onUpdate}
                    onDelete={() => onDelete(item)}
                    onEditStart={() => setEditing(props.idGetter(item))}
                    onCancel={() => setEditing(null)}
                />
            ))}
            {additionalRows.last}
        </div>
    );
}
