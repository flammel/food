import React, { useState, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ApiContext } from "../../Api/Context";
import ComboBox from "../ComboBox/ComboBox";
import { emptyConsumption, nutritionData } from "../../Domain/Consumption";
import { Consumable } from "../../Domain/Consumable";
import { dateToString } from "../../Utilities";
import Formatter from "../../Formatter";
import { nilUUID } from "../../Domain/UUID";
import TopBar, { Action, BackButton } from "../TopBar/TopBar";

interface ConsumptionUrlParams {
    date: string;
    id: string;
}
type ConsumptionPageProps = RouteComponentProps<ConsumptionUrlParams>;

export default function ConsumptionFormPage(props: ConsumptionPageProps): React.ReactElement {
    const api = useContext(ApiContext);
    const date = new Date(props.match.params.date || new Date().valueOf());
    const [consumption, setConsumption] = useState(emptyConsumption(date));
    const [editing, setEditing] = useState(false);

    const editingId = props.match.params.id;
    useEffect(() => {
        if (editingId) {
            const fetchFn = async () => {
                const loaded = await api.consumptions.read(editingId);
                setConsumption(loaded);
                setEditing(true);
            };
            fetchFn();
        }
    }, [editingId]);

    const consumableSearch = async (search: string): Promise<Consumable[]> => {
        return await api.consumables.autocomplete(search);
    };

    const onSelect = (consumable: Consumable): void =>
        setConsumption((prev) => ({
            ...prev,
            quantity: prev.consumable.value.id === nilUUID && consumable.type === "food" ? consumable.value.defaultQuantity : prev.quantity,
            consumable,
        }));

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const persist = async () => {
            if (editing) {
                await api.consumptions.update(consumption);
            } else {
                await api.consumptions.create(consumption);
            }
            props.history.push("/log/" + dateToString(date));
        };
        persist();
    };

    const onDelete = (): void => {
        const deleteFn = async () => {
            await api.consumptions.delete(consumption)
            props.history.push("/log/" + dateToString(date));
        };
        deleteFn();
    };

    const macros = nutritionData(consumption);

    return (
        <>
            <TopBar>
                <BackButton />
                {editing ? "Edit Consumption" : "New Consumption"}
                {editing ? <Action icon="delete" action={onDelete} /> : null}
            </TopBar>
            <form onSubmit={onSubmit} className="form">
                <div className="input-group">
                    <label className="input-group__label">Date</label>
                    <input className="input-group__input" type="date" name="date" value={dateToString(consumption.date)} onChange={(e) => {
                        const date = new Date(e.target.value);
                        setConsumption((prev) => ({ ...prev, date }));
                    }} />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Food or Recipe</label>
                    <ComboBox
                        onSelect={onSelect}
                        selected={consumption.consumable}
                        itemLabel={(consumable) => Formatter.consumable(consumable)}
                        itemKey={(consumable) => consumable.value.id.toString()}
                        search={consumableSearch}
                        autoFocus={true}
                        isInvalid={false}
                    />
                </div>
                <div className="input-group">
                    <label className="input-group__label">Quantity</label>
                    <input className="input-group__input" type="number" min="0" step="0.01" name="quantity" value={Formatter.quantity(consumption.quantity)} onChange={(e) => {
                        const quantity = parseInt(e.target.value);
                        setConsumption((prev) => ({ ...prev, quantity }));
                    }} />
                    <span className="input-group__suffix">
                        {Formatter.consumableUnit(consumption.consumable)}
                    </span>
                </div>
                <div className="input-group">
                    <div className="consumption consumption--only-macros">
                        <div className="consumption__macros">
                            <div className="consumption__macro" data-label="Calories">
                                {Formatter.calories(macros.calories)}
                            </div>
                            <div className="consumption__macro" data-label="Carbs">
                                {Formatter.macro(macros.carbs)}
                            </div>
                            <div className="consumption__macro" data-label="Fat">
                                {Formatter.macro(macros.fat)}
                            </div>
                            <div className="consumption__macro" data-label="Protein">
                                {Formatter.macro(macros.protein)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form__buttons">
                    <button type="submit" className="button button--primary">Save</button>
                </div>
            </form>
        </>
    );
}
