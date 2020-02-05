import React, { useState, useEffect, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import Formatter from "../../Formatter";
import TopBar, { Search, MenuButton } from "../TopBar/TopBar";
import { Food, emptyFood } from "../../Domain/Food";
import FloatingActionButton from "../FloatingActionButton";
import FoodFormPage from "./FoodForm";
import { nilUUID } from "../../Domain/UUID";

export default function FoodsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const editMatch = useRouteMatch<{ id: string }>("/foods/edit/:id");
    const addMatch = useRouteMatch("/foods/add");
    const [foods, setFoods] = useState<Food[]>([]);
    const [food, setFood] = useState<Food>(emptyFood);
    const [search, setSearch] = useState<string>("");

    const fetchFoods = async (): Promise<void> => {
        const result = await api.foods.search(search);
        setFoods(result);
    };
    useEffect(() => {
        fetchFoods();
    }, [search]);

    useEffect(() => {
        const editingId = editMatch?.params.id;
        if (editingId) {
            const fetchFn = async (): Promise<void> => {
                const loaded = await api.foods.read(editingId);
                if (loaded) {
                    setFood(loaded);
                }
            };
            fetchFn();
        } else {
            setFood(emptyFood);
        }
    }, [editMatch?.params.id]);

    return (
        <>
            <div className="main">
                <TopBar>
                    <MenuButton />
                    <Search placeholder="Search Foods" value={search} onChange={setSearch} />
                </TopBar>
                <div className="foods cards">
                    <div className="card card--header">
                        <div className="card__name">Name</div>
                        <div className="card__brand">Brand</div>
                        <div className="card__quantity">Quantity</div>
                        <div className="card__macros">
                            <div className="card__macro">Calories</div>
                            <div className="card__macro">Carbs</div>
                            <div className="card__macro">Fat</div>
                            <div className="card__macro">Protein</div>
                        </div>
                    </div>
                    {foods.length === 0 ? (
                        <p className="no-items">
                            No foods. <Link to="/foods/add">Create one?</Link>
                        </p>
                    ) : null}
                    {foods.map((food) => {
                        return (
                            <Link
                                to={"/foods/edit/" + food.id}
                                className={
                                    "food card " +
                                    (editMatch && editMatch.params.id !== food.id ? " card--inactive" : "") +
                                    (editMatch && editMatch.params.id === food.id ? " card--active" : "")
                                }
                                key={food.id}
                            >
                                <div className="card__consumable no-desktop">{Formatter.food(food)}</div>
                                <div className="card__name no-mobile">{food.name}</div>
                                <div className="card__brand no-mobile">{food.brand}</div>
                                <div className="card__quantity">
                                    {Formatter.quantity(food.defaultQuantity)}
                                    &nbsp;
                                    {Formatter.unit(food.unit)}
                                </div>
                                <div className="card__macros">
                                    <div className="card__macro" data-label="Calories">
                                        {Formatter.calories(food.calories)}
                                    </div>
                                    <div className="card__macro" data-label="Carbs">
                                        {Formatter.macro(food.carbs)}
                                    </div>
                                    <div className="card__macro" data-label="Fat">
                                        {Formatter.macro(food.fat)}
                                    </div>
                                    <div className="card__macro" data-label="Protein">
                                        {Formatter.macro(food.protein)}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <FloatingActionButton target="/foods/add" />
            </div>
            <div className={"side " + (editMatch || addMatch ? " side--visible" : "")}>
                <FoodFormPage food={food} editing={food.id !== nilUUID} reload={fetchFoods} />
            </div>
        </>
    );
}
