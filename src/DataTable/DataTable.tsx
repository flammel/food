import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export type ItemSetter<ItemType> = React.Dispatch<React.SetStateAction<ItemType>>;
export type ColumnForm<ItemType> = (item: ItemType, setItem: ItemSetter<ItemType>) => React.ReactElement;
export type ColumnDefinition<ItemType> = Array<Column<ItemType>>;

interface Column<ItemType> {
    id: string;
    label: string;
    value: (item: ItemType) => string;
    form?: ColumnForm<ItemType>;
}

type ItemId = string;

interface TableProps<ItemType> {
    className: string;
    columns: Column<ItemType>[];
    items: ItemType[];
    emptyItem: ItemType;
    idGetter: (item: ItemType) => ItemId;
    onCreate: (newItem: ItemType) => void;
    onUpdate: (newItem: ItemType) => void;
    onDelete: (item: ItemType) => void;
    onUndoDelete: (item: ItemType) => void;
    rows?: Partial<Rows<ItemType>>;
    createButtonLabel?: string;
    editUrl?: {
        url: (item: ItemType) => string;
        redirect: (item: ItemType) => void;
    };
}

interface Rows<ItemType> {
    first: React.ReactElement;
    header: React.ReactElement;
    subHeader: React.ReactElement;
    show: (item: ItemType) => React.ReactElement;
    edit: (item: ItemType) => React.ReactElement;
    deleted: (item: ItemType) => React.ReactElement;
    footer: React.ReactElement;
}

interface GenericRowProps<ItemType> {
    columns: ColumnDefinition<ItemType>;
}

interface HeaderRowProps<ItemType> extends GenericRowProps<ItemType> {}

function HeaderRow<ItemType>(props: HeaderRowProps<ItemType>) {
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

interface CreateRowProps<ItemType> extends GenericRowProps<ItemType> {
    emptyItem: ItemType;
    onCreate: (item: ItemType) => void;
    createButtonLabel?: string;
}

function CreateRow<ItemType>(props: CreateRowProps<ItemType>) {
    const [item, setItem] = useState<ItemType>(props.emptyItem);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onCreate(item);
        setItem(props.emptyItem);
    };

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
                <button className="btn btn-primary action action--visible" type="submit">
                    {props.createButtonLabel || "Save"}
                </button>
            </div>
        </form>
    );
}

interface ShowRowProps<ItemType> extends GenericRowProps<ItemType> {
    item: ItemType;
    onDelete: (item: ItemType) => void;
    editUrl?: (item: ItemType) => string;
    onEditStart: (item: ItemType) => void;
}

function ShowRow<ItemType>(props: ShowRowProps<ItemType>) {
    const [isHovering, setHovering] = useState(false);
    return (
        <div
            className="data-table__row"
            onDoubleClick={() => props.onEditStart(props.item)}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            {props.columns.map((column) => (
                <div key={column.id} className={"data-table__cell data-table__cell--" + column.id}>
                    <span className="data-table__value">{column.value(props.item)}</span>
                </div>
            ))}
            <div className="data-table__cell data-table__cell--actions">
                {props.editUrl ? (
                    <Link
                        className={"btn btn-info action action--larger" + (isHovering ? " action--visible" : "")}
                        to={props.editUrl(props.item)}
                    >
                        Edit
                    </Link>
                ) : (
                    <button
                        className={"btn btn-info action action--larger" + (isHovering ? " action--visible" : "")}
                        onClick={() => props.onEditStart(props.item)}
                    >
                        Edit
                    </button>
                )}
                <button
                    className={"btn btn-danger action" + (isHovering ? " action--visible" : "")}
                    onClick={() => props.onDelete(props.item)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

interface EditRowProps<ItemType> extends GenericRowProps<ItemType> {
    item: ItemType;
    onSave: (item: ItemType) => void;
    onCancel: () => void;
}

function EditRow<ItemType>(props: EditRowProps<ItemType>) {
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
                    Save
                </button>
                <button
                    className="btn btn-light action action--cancel action--visible"
                    type="button"
                    onClick={props.onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

interface DeletedRowProps<ItemType> extends GenericRowProps<ItemType> {
    item: ItemType;
}

function DeletedRow<ItemType>(props: DeletedRowProps<ItemType>) {
    return <></>;
}

export default function DataTable<ItemType>(props: TableProps<ItemType>) {
    const [editing, setEditing] = useState<ItemId>();
    const [deleted, setDeleted] = useState<ItemId>();
    const onUpdate = (item: ItemType) => {
        props.onUpdate(item);
        setEditing(null);
    };
    const onDelete = (item: ItemType) => {
        props.onDelete(item);
        setDeleted(props.idGetter(item));
    };
    const onEditStart = (item: ItemType) => {
        if (props.editUrl) {
            props.editUrl.redirect(item);
        } else {
            setEditing(props.idGetter(item));
        }
    };
    const defaultRows: Rows<ItemType> = {
        first: null,
        header: <HeaderRow columns={props.columns} />,
        subHeader: (
            <CreateRow
                columns={props.columns}
                emptyItem={props.emptyItem}
                onCreate={props.onCreate}
                createButtonLabel={props.createButtonLabel}
            />
        ),
        show: (item: ItemType) => (
            <ShowRow
                key={props.idGetter(item)}
                columns={props.columns}
                item={item}
                onDelete={onDelete}
                editUrl={props.editUrl ? props.editUrl.url : undefined}
                onEditStart={onEditStart}
            />
        ),
        edit: (item: ItemType) => (
            <EditRow
                key={props.idGetter(item)}
                columns={props.columns}
                item={item}
                onSave={onUpdate}
                onCancel={() => setEditing(null)}
            />
        ),
        deleted: (item: ItemType) => <DeletedRow key={props.idGetter(item)} columns={props.columns} item={item} />,
        footer: null,
    };
    const rows = { ...defaultRows, ...props.rows };
    return (
        <div className={"data-table " + props.className}>
            {rows.first}
            {rows.header}
            {rows.subHeader}
            {props.items.map(
                (item: ItemType): React.ReactElement => {
                    if (props.idGetter(item) === editing) {
                        return rows.edit(item);
                    }
                    if (props.idGetter(item) === deleted) {
                        return rows.deleted(item);
                    }
                    return rows.show(item);
                },
            )}
            {rows.footer}
        </div>
    );
}
