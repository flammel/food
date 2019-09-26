import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { Link } from "react-router-dom";

export type ItemSetter<ItemType> = React.Dispatch<React.SetStateAction<ItemType>>;
export type ColumnForm<ItemType> = (item: ItemType, setItem: ItemSetter<ItemType>) => React.ReactElement;
export type ColumnDefinition<ItemType> = Column<ItemType>[];

export interface Column<ItemType> {
    id: string;
    label: string;
    value: (item: ItemType) => string;
    form?: ColumnForm<ItemType>;
    header?: React.ReactElement;
}

export type TableEventHandler<ItemType> = (item: ItemType) => Promise<void>;

export interface BaseTableProps<ItemType> {
    emptyItem: ItemType;
    onCreate: TableEventHandler<ItemType>;
    onUpdate: TableEventHandler<ItemType>;
    onDelete: TableEventHandler<ItemType>;
    onUndoDelete: TableEventHandler<ItemType>;
    onDuplicate?: TableEventHandler<ItemType>;
}

type ItemId = string;

interface TableProps<ItemType> extends BaseTableProps<ItemType> {
    className: string;
    columns: Column<ItemType>[];
    items: ItemType[];
    idGetter: (item: ItemType) => ItemId;
    labelGetter: (item: ItemType) => string;
    rows?: Partial<Rows<ItemType>>;
    createButtonLabel?: string;
    editUrl?: {
        url: (item: ItemType) => string;
        redirect: (item: ItemType) => void;
    };
    focusAfterCreateRef?: MutableRefObject<HTMLInputElement | null>;
}

interface Rows<ItemType> {
    first: React.ReactElement | null;
    header: React.ReactElement;
    subHeader: React.ReactElement;
    show: (item: ItemType) => React.ReactElement;
    edit: (item: ItemType) => React.ReactElement;
    deleted: (item: ItemType) => React.ReactElement;
    footer: React.ReactElement | null;
}

interface GenericRowProps<ItemType> {
    columns: ColumnDefinition<ItemType>;
}

interface ColumnsWithItemProps<ItemType> extends GenericRowProps<ItemType> {
    cellClass?: string;
    children: (column: Column<ItemType>, item: ItemType) => React.ReactChild;
    item: ItemType;
}

interface ColumnsWithoutItemProps<ItemType> extends GenericRowProps<ItemType> {
    cellClass?: string;
    children: (column: Column<ItemType>) => React.ReactChild;
}

type ColumnsProps<ItemType> = ColumnsWithItemProps<ItemType> | ColumnsWithoutItemProps<ItemType>;

function hasItem<ItemType>(props: ColumnsProps<ItemType>): props is ColumnsWithItemProps<ItemType> {
    return Object.prototype.hasOwnProperty.call(props, "item");
}

function Columns<ItemType>(props: ColumnsProps<ItemType>): React.ReactElement {
    return (
        <>
            {props.columns.map((column) => (
                <div
                    key={column.id}
                    className={"data-table__cell " + (props.cellClass || "") + " data-table__cell--id-" + column.id}
                >
                    {hasItem(props) ? props.children(column, props.item) : props.children(column)}
                </div>
            ))}
        </>
    );
}

type HeaderRowProps<ItemType> = GenericRowProps<ItemType>;

function HeaderRow<ItemType>(props: HeaderRowProps<ItemType>): React.ReactElement {
    return (
        <div className="data-table__row data-table__row--header">
            <Columns columns={props.columns} cellClass="data-table__cell--header">
                {(column: Column<ItemType>) => (column.header ? column.header : column.label)}
            </Columns>
            <div className="data-table__cell data-table__cell--header data-table__cell--actions"></div>
        </div>
    );
}

interface CreateRowProps<ItemType> extends GenericRowProps<ItemType> {
    emptyItem: ItemType;
    onCreate: TableEventHandler<ItemType>;
    createButtonLabel?: string;
    focusAfterCreateRef?: MutableRefObject<HTMLInputElement | null>;
}

function CreateRow<ItemType>(props: CreateRowProps<ItemType>): React.ReactElement {
    const [item, setItem] = useState<ItemType>(props.emptyItem);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        props
            .onCreate(item)
            .then(() => {
                setItem(props.emptyItem);
                if (props.focusAfterCreateRef && props.focusAfterCreateRef.current) {
                    props.focusAfterCreateRef.current.focus();
                }
            })
            .catch(() => {});
    };

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (!isFirstRun.current) {
            setItem(props.emptyItem);
        } else {
            isFirstRun.current = false;
        }
    }, [props.emptyItem]);

    return (
        <form className="data-table__row data-table__row--form data-table__row--create" onSubmit={onSubmit}>
            <Columns columns={props.columns} item={item}>
                {(column, item) => (
                    <span className="data-table__value" data-label={column.label}>
                        {column.form ? column.form(item, setItem) : column.value(item)}
                    </span>
                )}
            </Columns>
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
    onDuplicate?: (item: ItemType) => void;
}

function ShowRow<ItemType>(props: ShowRowProps<ItemType>): React.ReactElement {
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
    const onDuplicate = props.onDuplicate ? props.onDuplicate : () => {};
    return (
        <div
            className="data-table__row data-table__row--show"
            onDoubleClick={() => props.onEditStart(props.item)}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            <Columns columns={props.columns} item={props.item}>
                {(column, item) => (
                    <span className="data-table__value" data-label={column.label}>
                        {column.value(item)}
                    </span>
                )}
            </Columns>
            <div className="data-table__cell data-table__cell--actions">
                {editButton}
                {props.onDuplicate ? (
                    <button
                        className={"btn btn-light action" + (isHovering ? " action--visible" : "")}
                        onClick={() => onDuplicate(props.item)}
                    >
                        Copy
                    </button>
                ) : null}
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
    onSave: TableEventHandler<ItemType>;
    onCancel: () => void;
}

function EditRow<ItemType>(props: EditRowProps<ItemType>): React.ReactElement {
    const [item, setItem] = useState<ItemType>(props.item);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        props
            .onSave(item)
            .then(() => {})
            .catch(() => {});
    };

    const onEscape = (e: KeyboardEvent): void => {
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
        <form className="data-table__row data-table__row--form data-table__row--edit" onSubmit={onSubmit}>
            <Columns columns={props.columns} item={item}>
                {(column, item) => (
                    <span className="data-table__value" data-label={column.label}>
                        {column.form ? column.form(item, setItem) : column.value(item)}
                    </span>
                )}
            </Columns>
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

function DeletedRow<ItemType>(props: DeletedRowProps<ItemType>): React.ReactElement {
    const onUndo = (e: React.MouseEvent): void => {
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

export default function DataTable<ItemType>(props: TableProps<ItemType>): React.ReactElement {
    const [editing, setEditing] = useState<ItemId>();
    const [deleted, setDeleted] = useState<[number, ItemType]>();
    const deletedTimeout = useRef(-1);
    const onUpdate = (item: ItemType): Promise<void> =>
        new Promise((res, rej) =>
            props
                .onUpdate(item)
                .then(() => {
                    setEditing(undefined);
                    res();
                })
                .catch(() => rej()),
        );
    const onDelete = (item: ItemType): void => {
        clearTimeout(deletedTimeout.current);
        props.onDelete(item);
        setDeleted([props.items.indexOf(item), item]);
        deletedTimeout.current = setTimeout(() => setDeleted(undefined), 4000);
    };
    const onUndoDelete = (item: ItemType): void => {
        clearTimeout(deletedTimeout.current);
        props.onUndoDelete(item);
        setDeleted(undefined);
    };
    const onEditStart = (item: ItemType): void => {
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
                focusAfterCreateRef={props.focusAfterCreateRef}
            />
        ),
        show: (item: ItemType) => (
            <ShowRow
                columns={props.columns}
                item={item}
                onDelete={onDelete}
                editUrl={props.editUrl ? props.editUrl.url : undefined}
                onEditStart={onEditStart}
                onDuplicate={props.onDuplicate}
            />
        ),
        edit: (item: ItemType) => (
            <EditRow columns={props.columns} item={item} onSave={onUpdate} onCancel={() => setEditing(undefined)} />
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
            {deleted !== undefined &&
            ((props.items.length === 0 && deleted[0] >= 0) || props.items.length === deleted[0])
                ? rows.deleted(deleted[1])
                : null}
            {rows.footer}
        </div>
    );
}
