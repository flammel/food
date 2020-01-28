import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { MenuButton } from "../TopBar/TopBar";
import { Food } from "../../Domain/Food";

export default function FoodsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const [foods, setFoods] = useState<Food[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchFoods = async () => {
            const result = await api.foods.search(search);
            setFoods(result);
        };
        fetchFoods();
    }, [search]);

    return (
        <>
            <TopBar>
                <MenuButton />
                Foods
            </TopBar>
            <div className="search input-group">
                <input type="text" className="input-group__input search__input" value={search} onChange={(e) => {
                    setSearch(e.target.value);
                }} />
                <svg className="search__icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
            </div>
            {foods.map((food) => {
                return (
                    <Link to={"/foods/" + food.id} className="food" key={food.id}>
                        <div className="food__consumable">{Formatter.food(food)}</div>
                        <div className="food__quantity">{Formatter.quantity(food.defaultQuantity)}</div>
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
            <Link className="fab" to="/foods/add">
                <svg className="fab__icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path></svg>
            </Link>
        </>
    );
}
