import React, { useState } from "react";
import FoodsTable from "./FoodsTable";
import { Food } from "./Data";
import Repository from "./FoodsRepository";

export default function Foods() {
    const [foods, setFoods] = useState(Repository.load());
    const repoAction = (action: (food: Food) => void) => {
        return (food: Food) => {
            action(food);
            setFoods(Repository.load());
        };
    };
    return (
        <>
            <FoodsTable
                foods={foods}
                brands={Array.from(new Set(foods.map((f) => f.brand)))}
                onCreate={repoAction(Repository.create)}
                onUpdate={repoAction(Repository.update)}
                onDelete={repoAction(Repository.delete)}
                onUndoDelete={repoAction(Repository.undoDelete)}
            />
        </>
    );
}
