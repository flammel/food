import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router";
import FoodsTable from "./FoodsTable";
import { emptyFood, Food, Brand } from "../Data";
import { ApiContext } from "../../Api/Context";

export default function FoodsPage(): React.ReactElement<RouteComponentProps> {
    const api = useContext(ApiContext);
    const [foods, setFoods] = useState<Food[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const fetchFoods = async () => {
        const result = await api.foods.load();
        setFoods(result);
        const uniqueBrands = new Set(result.map((food) => food.brand));
        setBrands([...uniqueBrands]);
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    return (
        <>
            <FoodsTable
                foods={foods}
                brands={brands}
                emptyItem={emptyFood}
                onCreate={(item) => api.foods.create(item).then(fetchFoods)}
                onUpdate={(item) => api.foods.update(item).then(fetchFoods)}
                onDelete={(item) => api.foods.delete(item).then(fetchFoods)}
                onUndoDelete={(item) => api.foods.undoDelete(item).then(fetchFoods)}
            />
        </>
    );
}
