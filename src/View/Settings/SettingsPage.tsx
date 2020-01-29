import React, { useState, useContext, useEffect } from "react";
import { Settings, emptySettings } from "../../Domain/Settings";
import { ApiContext } from "../../Api/Context";
import TopBar, { MenuButton, Title } from "../TopBar/TopBar";

export default function SettingsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const [settings, setSettings] = useState<Settings>(emptySettings);

    useEffect(() => {
        const fetchSettings = async () => {
            const result = await api.settings.load();
            setSettings(result);
        };
        fetchSettings();
    }, []);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const update = async () => {
            await api.settings.update(settings);
        };
        update();
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
        <>
            <TopBar>
                <MenuButton />
                <Title>Settings</Title>
            </TopBar>
            <form onSubmit={onSubmit} className="form">
                <fieldset>
                    <legend>Targets</legend>
                    <div className="input-group">
                        <label htmlFor="inputTargetCalories" className="input-group__label">
                            Calories
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            className="input-group__input"
                            id="inputTargetCalories"
                            placeholder="Calories"
                            value={settings.targetCalories}
                            onChange={onChange((newValue) => ({ targetCalories: newValue }))}
                        />
                        <div className="input-group__suffix">kcal</div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inputTargetFat" className="input-group__label">
                            Fat
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            className="input-group__input"
                            id="inputTargetFat"
                            placeholder="Fat"
                            value={settings.targetFat}
                            onChange={onChange((newValue) => ({ targetFat: newValue }))}
                        />
                        <div className="input-group__suffix">g</div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inputTargetCarbs" className="input-group__label">
                            Carbs
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            className="input-group__input"
                            id="inputTargetCarbs"
                            placeholder="Carbs"
                            value={settings.targetCarbs}
                            onChange={onChange((newValue) => ({ targetCarbs: newValue }))}
                        />
                        <div className="input-group__suffix">g</div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inputTargetProtein" className="input-group__label">
                            Protein
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            className="input-group__input"
                            id="inputTargetProtein"
                            placeholder="Protein"
                            value={settings.targetProtein}
                            onChange={onChange((newValue) => ({ targetProtein: newValue }))}
                        />
                        <div className="input-group__suffix">g</div>
                    </div>
                </fieldset>
                <div className="form__buttons">
                    <button type="submit" className={"button button--primary"}>
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
