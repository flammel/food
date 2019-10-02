import React, { useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Recipe, emptyRecipe } from "../Data";
import RecipesTable from "./RecipesTable";
import { createAction, updateAction, deleteAction, undoDeleteAction, duplicateAction } from "../Actions";
import { AppStateContext } from "../../AppState/Context";
import { sortedRecipes } from "../../AppState/Functions";

type RecipesPageProps = RouteComponentProps;

function Recipes(props: RecipesPageProps): React.ReactElement {
    const [appState, reducer] = useContext(AppStateContext);
    const goToEdit = (item: Recipe): void => {
        props.history.push("/recipes/" + item.id);
    };
    return (
        <>
            <RecipesTable
                recipes={sortedRecipes(appState)}
                emptyItem={emptyRecipe}
                onCreate={(item) => reducer(createAction(item))}
                onUpdate={(item) => reducer(updateAction(item))}
                onDelete={(item) => reducer(deleteAction(item))}
                onUndoDelete={(item) => reducer(undoDeleteAction(item))}
                onDuplicate={(item) => reducer(duplicateAction(item))}
                // onDuplicate={(recipe) => {
                //     const duplicate = RecipesRepository.duplicate(recipe);
                //     goToEdit(duplicate);
                // }}
                goToEdit={goToEdit}
            />
        </>
    );
}

export default withRouter(Recipes);
