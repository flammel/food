import React, { useState, useEffect, useRef } from "react";
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
    labelGetter: (item: ItemType) => string;
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
    let editButton;
    if (props.editUrl) {
        editButton = (
            <Link
                className={"btn btn-info action action--larger" + (isHovering ? " action--visible" : "")}
                to={props.editUrl(props.item)}
            >
                Edit
            </Link>
        );
    } else {
        editButton = (
            <button
                className={"btn btn-info action action--larger" + (isHovering ? " action--visible" : "")}
                onClick={() => props.onEditStart(props.item)}
            >
                Edit
            </button>
        );
    }
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
                {editButton}
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
    onUndoDelete: (item: ItemType) => void;
    labelGetter: (item: ItemType) => string;
}

function DeletedRow<ItemType>(props: DeletedRowProps<ItemType>) {
    const onUndo = (e: React.MouseEvent) => {
        e.preventDefault();
        props.onUndoDelete(props.item);
    };
    return (
        <div className="data-table__row data-table__row--deleted">
            <div className="data-table__cell data-table__cell--full-width">
                <span className="data-table__value">
                    {props.labelGetter(props.item)} deleted.&nbsp;
                    <a className="undo-delete-link" onClick={onUndo}>
                        Undo
                    </a>
                </span>
            </div>
        </div>
    );
}

export default function DataTable<ItemType>(props: TableProps<ItemType>) {
    const [editing, setEditing] = useState<ItemId>();
    const [deleted, setDeleted] = useState<[number, ItemType]>();
    const deletedTimeout = useRef(-1);
    const onUpdate = (item: ItemType) => {
        props.onUpdate(item);
        setEditing(null);
    };
    const onDelete = (item: ItemType) => {
        clearTimeout(deletedTimeout.current);
        props.onDelete(item);
        setDeleted([props.items.indexOf(item), item]);
        deletedTimeout.current = setTimeout(() => setDeleted(null), 4000);
    };
    const onUndoDelete = (item: ItemType) => {
        clearTimeout(deletedTimeout.current);
        props.onUndoDelete(item);
        setDeleted(null);
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
                columns={props.columns}
                item={item}
                onDelete={onDelete}
                editUrl={props.editUrl ? props.editUrl.url : undefined}
                onEditStart={onEditStart}
            />
        ),
        edit: (item: ItemType) => (
            <EditRow columns={props.columns} item={item} onSave={onUpdate} onCancel={() => setEditing(null)} />
        ),
        deleted: (item: ItemType) => (
            <DeletedRow
                columns={props.columns}
                item={item}
                onUndoDelete={onUndoDelete}
                labelGetter={props.labelGetter}
            />
        ),
        footer: null,
    };
    const rows = { ...defaultRows, ...props.rows };
    const allItemsDeleted = deleted && props.items.length === 0 && deleted[0] >= 0;
    const lastItemDeleted = deleted && props.items.length === deleted[0];
    return (
        <div className={"data-table " + props.className}>
            {rows.first}
            {rows.header}
            {rows.subHeader}
            {props.items.map(
                (item: ItemType, idx: number): React.ReactElement => {
                    return (
                        <React.Fragment key={props.idGetter(item)}>
                            {deleted && deleted[0] >= 0 && idx === deleted[0] ? rows.deleted(deleted[1]) : null}
                            {props.idGetter(item) === editing ? rows.edit(item) : rows.show(item)}
                        </React.Fragment>
                    );
                },
            )}
            {allItemsDeleted || lastItemDeleted ? rows.deleted(deleted[1]) : null}
            {rows.footer}
        </div>
    );
}
