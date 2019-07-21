import React, { useState } from "react";
import FoodsTable from "./FoodsTable";
import { Food, loadFoods, saveFood, deleteFood } from "./Data";

export default function Foods() {
    const [foods, setFoods] = useState(loadFoods());
    const onSave = (newFood: Food, oldFood?: Food) => {
        saveFood(newFood, oldFood);
        setFoods(loadFoods());
    };
    const onDelete = (food: Food) => {
        deleteFood(food);
        setFoods(loadFoods());
    };
    return (
        <>
            <FoodsTable foods={foods} onSave={onSave} onDelete={onDelete} />
        </>
    );
}
