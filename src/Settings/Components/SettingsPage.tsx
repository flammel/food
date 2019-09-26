import React, { useState, useRef, useContext } from "react";
import { Settings } from "../Data";
import { AppStateContext } from "../../AppState/Context";
import { saveAction } from "../Actions";

export default function SettingsPage(): React.ReactElement {
    const [appState, reducer] = useContext(AppStateContext);
    const [settings, setSettings] = useState<Settings>(appState.settings);
    const [saved, setSaved] = useState(false);
    const savedTimeout = useRef(-1);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        reducer(saveAction(settings));
        clearTimeout(savedTimeout.current);
        setSaved(true);
        savedTimeout.current = setTimeout(() => setSaved(false), 800);
    };

    const onChange = (
        partial: (newValue: number) => Partial<Settings>,
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e) => {
            const newValue = parseInt(e.currentTarget.value);
            if (newValue >= 0) {
                setSettings((prev) => ({ ...prev, ...partial(newValue) }));
            }
        };
    };

    return (
        <div className="row">
            <div className="col col-xl-4 col-md-6 col-sm-8">
                <h1>Settings</h1>
                <form onSubmit={onSubmit}>
                    <fieldset>
                        <legend>Targets</legend>
                        <div className="form-group row">
                            <label htmlFor="inputTargetCalories" className="col-4 col-form-label">
                                Calories
                            </label>
                            <div className="col-8 input-group">
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    className="form-control"
                                    id="inputTargetCalories"
                                    placeholder="Calories"
                                    value={appState.settings.targetCalories}
                                    onChange={onChange((newValue) => ({ targetCalories: newValue }))}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">kcal</div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputTargetFat" className="col-4 col-form-label">
                                Fat
                            </label>
                            <div className="col-8 input-group">
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    className="form-control"
                                    id="inputTargetFat"
                                    placeholder="Fat"
                                    value={appState.settings.targetFat}
                                    onChange={onChange((newValue) => ({ targetFat: newValue }))}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">g</div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputTargetCarbs" className="col-4 col-form-label">
                                Carbs
                            </label>
                            <div className="col-8 input-group">
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    className="form-control"
                                    id="inputTargetCarbs"
                                    placeholder="Carbs"
                                    value={appState.settings.targetCarbs}
                                    onChange={onChange((newValue) => ({ targetCarbs: newValue }))}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">g</div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputTargetProtein" className="col-4 col-form-label">
                                Protein
                            </label>
                            <div className="col-8 input-group">
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    className="form-control"
                                    id="inputTargetProtein"
                                    placeholder="Protein"
                                    value={appState.settings.targetProtein}
                                    onChange={onChange((newValue) => ({ targetProtein: newValue }))}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">g</div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="form-group row">
                        <div className="col-8 offset-4">
                            <button
                                type="submit"
                                className={"btn btn-primary btn-block " + (saved ? "btn-saved" : "")}
                                disabled={saved}
                            >
                                {saved ? "Saved!" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
