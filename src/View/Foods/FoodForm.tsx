import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import ComboBox from "../ComboBox/ComboBox";
import { Brand, Food } from "../../Domain/Food";
import Formatter from "../../Formatter";
import TopBar, { BackButton, Action, Title } from "../TopBar/TopBar";
import { SnackbarContext, Snackbar } from "../Snackbar";
import NumberInput from "../NumberInput";

interface FoodFormProps {
    food: Food;
    editing: boolean;
    reload: () => void;
}

export default function FoodFormPage(props: FoodFormProps): React.ReactElement {
    const api = useContext(ApiContext);
    const snackbar = useContext(SnackbarContext);
    const history = useHistory();
    const [food, setFood] = useState(props.food);

    useEffect(() => setFood(props.food), [props.food.id]);

    const onDelete = (): void => {
        const deleteFn = async (): Promise<void> => {
            await api.foods.delete(food);
            history.push("/foods");
            props.reload();
            snackbar.show(
                <Snackbar
                    text={"Deleted " + Formatter.food(food)}
                    action={{
                        text: "Undo",
                        fn: () => {
                            api.foods.undoDelete(food);
                            props.reload();
                        },
                    }}
                />,
            );
        };
        deleteFn();
    };
    const brandSearch = async (search: string): Promise<Brand[]> => {
        return await api.brands.autocomplete(search);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const persist = async (): Promise<void> => {
            if (props.editing) {
                await api.foods.update(food);
            } else {
                await api.foods.create(food);
            }
            history.push("/foods");
            props.reload();
        };
        persist();
    };

    return (
        <>
            <TopBar>
                <BackButton to="/foods" />
                <Title>{props.editing ? "Edit Food" : "New Food"}</Title>
                {props.editing ? <Action icon="delete" action={onDelete} /> : null}
            </TopBar>
            <form onSubmit={onSubmit} className="form">
                <div className="input-group">
                    <label className="input-group__label">Name</label>
                    <input
                        autoFocus={props.editing ? false : true}
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
                    <NumberInput
                        name="defaultQuantity"
                        decimal={false}
                        value={food.defaultQuantity}
                        onChange={(defaultQuantity) => setFood((prev) => ({ ...prev, defaultQuantity }))}
                    />
                    <span className="input-group__suffix">g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Calories</label>
                    <NumberInput
                        name="calories"
                        decimal={false}
                        value={food.calories}
                        onChange={(calories) => setFood((prev) => ({ ...prev, calories }))}
                    />
                    <span className="input-group__suffix">kcal/100 g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Carbs</label>
                    <NumberInput
                        name="carbs"
                        decimal={true}
                        value={food.carbs}
                        onChange={(carbs) => setFood((prev) => ({ ...prev, carbs }))}
                    />
                    <span className="input-group__suffix">g/100 g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Fat</label>
                    <NumberInput
                        name="fat"
                        decimal={true}
                        value={food.fat}
                        onChange={(fat) => setFood((prev) => ({ ...prev, fat }))}
                    />
                    <span className="input-group__suffix">g/100 g</span>
                </div>
                <div className="input-group">
                    <label className="input-group__label">Protein</label>
                    <NumberInput
                        name="protein"
                        decimal={true}
                        value={food.protein}
                        onChange={(protein) => setFood((prev) => ({ ...prev, protein }))}
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
