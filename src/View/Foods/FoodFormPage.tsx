import React, { useState, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import ComboBox from "../ComboBox/ComboBox";
import { emptyFood, Brand } from "../../Domain/Food";
import Formatter from "../../Formatter";
import TopBar, { BackButton, Action } from "../TopBar/TopBar";

interface FoodFormPageUrlParams {
    id: string;
}
type FoodFormPagePageProps = RouteComponentProps<FoodFormPageUrlParams>;

export default function FoodFormPage(props: FoodFormPagePageProps): React.ReactElement {
    const api = useContext(ApiContext);
    const [food, setFood] = useState(emptyFood);
    const [editing, setEditing] = useState(false);

    const editingId = props.match.params.id;
    useEffect(() => {
        if (editingId) {
            const fetchFn = async () => {
                const loaded = await api.foods.read(editingId);
                setFood(loaded);
                setEditing(true);
            };
            fetchFn();
        }
    }, [editingId]);

    const brandSearch = async (search: string): Promise<Brand[]> => {
        return await api.brands.autocomplete(search);
    };

    const onSelect = (brand: Brand): void =>
        setFood((prev) => ({
            ...prev,
            brand,
        }));

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const persist = async () => {
            if (editing) {
                await api.foods.update(food);
            } else {
                await api.foods.create(food);
            }
            props.history.push("/foods");
        };
        persist();
    };

    const onDelete = (): void => {
        const deleteFn = async () => {
            await api.foods.delete(food)
            props.history.push("/foods");
        };
        deleteFn();
    };

    return (
        <>
            <TopBar>
                <BackButton />
                {editing ? "Edit Food" : "New Food"}
                {editing ? <Action icon="delete" action={onDelete} /> : null}
            </TopBar>
            <form onSubmit={onSubmit} className="form">
                <div className="input-group">
                    <label className="input-group__label">Name</label>
                    <input className="input-group__input" type="text" required value={food.name} onChange={(e) => {
                        const name = e.target.value;
                        setFood((prev) => ({ ...prev, name: name }));
                    }} />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Brand</label>
                    <ComboBox
                        onSelect={onSelect}
                        selected={food.brand}
                        itemLabel={(brand) => brand}
                        itemKey={(brand) => brand}
                        search={brandSearch}
                        autoFocus={true}
                        isInvalid={false}
                    />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Default Quantity</label>
                    <input className="input-group__input" type="number" min="0" step="1" required value={Formatter.quantity(food.defaultQuantity)} onChange={(e) => {
                        const defaultQuantity = parseInt(e.target.value);
                        setFood((prev) => ({ ...prev, defaultQuantity }));
                    }} />
                    <span className="input-group__suffix">
                        g
                    </span>
                </div>
                <div className="macro-inputs">
                    <div className="input-group">
                        <label className="input-group__label">Calories</label>
                        <input className="input-group__input" type="number" min="0" step="1" required value={Formatter.calories(food.calories)} onChange={(e) => {
                            const calories = parseFloat(e.target.value);
                            setFood((prev) => ({ ...prev, calories }));
                        }} />
                    </div>
                    <div className="input-group">
                        <label className="input-group__label">Carbs</label>
                        <input className="input-group__input" type="number" min="0" step="0.1" required value={Formatter.macro(food.carbs)} onChange={(e) => {
                            const carbs = parseFloat(e.target.value);
                            setFood((prev) => ({ ...prev, carbs }));
                        }} />
                    </div>
                    <div className="input-group">
                        <label className="input-group__label">Fat</label>
                        <input className="input-group__input" type="number" min="0" step="0.1" required value={Formatter.macro(food.fat)} onChange={(e) => {
                            const fat = parseFloat(e.target.value);
                            setFood((prev) => ({ ...prev, fat }));
                        }} />
                    </div>
                    <div className="input-group">
                        <label className="input-group__label">Protein</label>
                        <input className="input-group__input" type="number" min="0" step="0.1" required value={Formatter.macro(food.protein)} onChange={(e) => {
                            const protein = parseFloat(e.target.value);
                            setFood((prev) => ({ ...prev, protein }));
                        }} />
                    </div>
                </div>
                <div className="form__buttons">
                    <button type="submit" className="button button--primary">Save</button>
                </div>
            </form>
        </>
    );
}
