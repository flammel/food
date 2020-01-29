import React, { useState, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import ComboBox from "../ComboBox/ComboBox";
import { emptyFood, Brand } from "../../Domain/Food";
import Formatter from "../../Formatter";
import TopBar, { BackButton, Action, Title } from "../TopBar/TopBar";
import { SnackbarContext, Snackbar } from "../Snackbar";

interface FoodFormPageUrlParams {
    id: string;
}
type FoodFormPagePageProps = RouteComponentProps<FoodFormPageUrlParams>;

export default function FoodFormPage(props: FoodFormPagePageProps): React.ReactElement {
    const api = useContext(ApiContext);
    const snackbar = useContext(SnackbarContext);
    const [food, setFood] = useState(emptyFood);
    const [formValues, setFormValues] = useState({
        defaultQuantity: "1",
        calories: "",
        carbs: "",
        fat: "",
        protein: "",
    });
    const [editing, setEditing] = useState(false);

    const editingId = props.match.params.id;
    useEffect(() => {
        if (editingId) {
            const fetchFn = async (): Promise<void> => {
                const loaded = await api.foods.read(editingId);
                setFood(loaded);
                setFormValues({
                    defaultQuantity: Formatter.quantity(loaded.defaultQuantity),
                    calories: Formatter.calories(loaded.calories),
                    carbs: Formatter.macro(loaded.carbs),
                    fat: Formatter.macro(loaded.fat),
                    protein: Formatter.macro(loaded.protein),
                });
                setEditing(true);
            };
            fetchFn();
        }
    }, [editingId]);

    const brandSearch = async (search: string): Promise<Brand[]> => {
        return await api.brands.autocomplete(search);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const values = {
            ...food,
            defaultQuantity: parseInt(formValues.defaultQuantity),
            calories: parseInt(formValues.calories),
            carbs: parseFloat(formValues.carbs),
            fat: parseFloat(formValues.fat),
            protein: parseFloat(formValues.protein),
        };
        const persist = async (): Promise<void> => {
            if (editing) {
                await api.foods.update(values);
            } else {
                await api.foods.create(values);
            }
            props.history.push("/foods");
        };
        persist();
    };

    const onDelete = (): void => {
        const deleteFn = async (): Promise<void> => {
            await api.foods.delete(food);
            props.history.push("/foods");
            snackbar.show(
                <Snackbar
                    text={"Deleted " + Formatter.food(food)}
                    action={{ text: "Undo", fn: () => api.foods.undoDelete(food) }}
                />,
            );
        };
        deleteFn();
    };

    return (
        <>
            <TopBar>
                <BackButton />
                <Title>{editing ? "Edit Food" : "New Food"}</Title>
                {editing ? <Action icon="delete" action={onDelete} /> : null}
            </TopBar>
            <form onSubmit={onSubmit} className="form">
                <div className="input-group">
                    <label className="input-group__label">Name</label>
                    <input
                        autoFocus={editing ? false : true}
                        className="input-group__input"
                        type="text"
                        required
                        value={food.name}
                        onChange={(e) => {
                            const name = e.target.value;
                            setFood((prev) => ({ ...prev, name: name }));
                        }}
                    />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Brand</label>
                    <ComboBox
                        onSelect={(brand: Brand | null): void =>
                            setFood((prev) => ({
                                ...prev,
                                brand: brand || "",
                            }))
                        }
                        onChange={(brand: Brand): void =>
                            setFood((prev) => ({
                                ...prev,
                                brand,
                            }))
                        }
                        selected={food.brand}
                        itemLabel={(brand) => brand}
                        itemKey={(brand) => brand}
                        search={brandSearch}
                        isInvalid={false}
                    />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Default Quantity</label>
                    <input
                        className="input-group__input"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formValues.defaultQuantity}
                        onChange={(e) => {
                            const defaultQuantity = e.target.value;
                            setFormValues((prev) => ({ ...prev, defaultQuantity }));
                        }}
                        onBlur={(e) => {
                            const defaultQuantity = Formatter.quantity(parseInt(e.target.value));
                            setFormValues((prev) => ({ ...prev, defaultQuantity }));
                        }}
                    />
                    <span className="input-group__suffix">g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Calories</label>
                    <input
                        className="input-group__input"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        required
                        value={formValues.calories}
                        onChange={(e) => {
                            const calories = e.target.value;
                            setFormValues((prev) => ({ ...prev, calories }));
                        }}
                        onBlur={(e) => {
                            const calories = Formatter.calories(parseInt(e.target.value));
                            setFormValues((prev) => ({ ...prev, calories }));
                        }}
                    />
                    <span className="input-group__suffix">kcal/100 g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Carbs</label>
                    <input
                        className="input-group__input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        required
                        value={formValues.carbs}
                        onChange={(e) => {
                            const carbs = e.target.value;
                            setFormValues((prev) => ({ ...prev, carbs }));
                        }}
                        onBlur={(e) => {
                            const carbs = Formatter.macro(parseFloat(e.target.value));
                            setFormValues((prev) => ({ ...prev, carbs }));
                        }}
                    />
                    <span className="input-group__suffix">g/100 g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Fat</label>
                    <input
                        className="input-group__input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        required
                        value={formValues.fat}
                        onChange={(e) => {
                            const fat = e.target.value;
                            setFormValues((prev) => ({ ...prev, fat }));
                        }}
                        onBlur={(e) => {
                            const fat = Formatter.macro(parseFloat(e.target.value));
                            setFormValues((prev) => ({ ...prev, fat }));
                        }}
                    />
                    <span className="input-group__suffix">g/100 g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Protein</label>
                    <input
                        className="input-group__input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        required
                        value={formValues.protein}
                        onChange={(e) => {
                            const protein = e.target.value;
                            setFormValues((prev) => ({ ...prev, protein }));
                        }}
                        onBlur={(e) => {
                            const protein = Formatter.macro(parseFloat(e.target.value));
                            setFormValues((prev) => ({ ...prev, protein }));
                        }}
                    />
                    <span className="input-group__suffix">g/100 g</span>
                </div>
                <div className="form__buttons">
                    <button type="submit" className="button button--primary">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
