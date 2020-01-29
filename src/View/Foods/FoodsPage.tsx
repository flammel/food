import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { Search, MenuButton } from "../TopBar/TopBar";
import { Food } from "../../Domain/Food";
import FloatingActionButton from "../FloatingActionButton";

export default function FoodsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const [foods, setFoods] = useState<Food[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchFoods = async (): Promise<void> => {
            const result = await api.foods.search(search);
            setFoods(result);
        };
        fetchFoods();
    }, [search]);

    return (
        <>
            <TopBar>
                <MenuButton />
                <Search placeholder="Search Foods" value={search} onChange={setSearch} />
            </TopBar>
            {foods.length === 0 ? (
                <p className="no-items">
                    No foods. <Link to="/foods/add">Create one?</Link>
                </p>
            ) : null}
            {foods.map((food) => {
                return (
                    <Link to={"/foods/" + food.id} className="food" key={food.id}>
                        <div className="food__consumable">{Formatter.food(food)}</div>
                        <div className="food__quantity">
                            {Formatter.quantity(food.defaultQuantity)}
                            &nbsp;
                            {Formatter.unit(food.unit)}
                        </div>
                        <div className="food__macros">
                            <div className="food__macro" data-label="Calories">
                                {Formatter.calories(food.calories)}
                            </div>
                            <div className="food__macro" data-label="Carbs">
                                {Formatter.macro(food.carbs)}
                            </div>
                            <div className="food__macro" data-label="Fat">
                                {Formatter.macro(food.fat)}
                            </div>
                            <div className="food__macro" data-label="Protein">
                                {Formatter.macro(food.protein)}
                            </div>
                        </div>
                    </Link>
                );
            })}
            <FloatingActionButton target="/foods/add" />
        </>
    );
}
