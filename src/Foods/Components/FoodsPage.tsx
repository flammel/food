import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import FoodsTable from "./FoodsTable";
import { createAction, updateAction, deleteAction, undoDeleteAction } from "../Actions";
import { AppStateContext } from "../../AppState/Context";
import { emptyFood } from "../Data";
import { sortedFoods, brands } from "../../AppState/Functions";

export default function FoodsPage(): React.ReactElement<RouteComponentProps> {
    const [appState, reducer] = useContext(AppStateContext);
    return (
        <>
            <FoodsTable
                foods={sortedFoods(appState)}
                brands={brands(appState)}
                emptyItem={emptyFood}
                onCreate={(item) => reducer(createAction(item))}
                onUpdate={(item) => reducer(updateAction(item))}
                onDelete={(item) => reducer(deleteAction(item))}
                onUndoDelete={(item) => reducer(undoDeleteAction(item))}
            />
        </>
    );
}
