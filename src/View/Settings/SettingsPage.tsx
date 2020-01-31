import React, { useState, useContext, useEffect } from "react";
import { Settings, emptySettings } from "../../Domain/Settings";
import { ApiContext } from "../../Api/Context";
import TopBar, { MenuButton, Title } from "../TopBar/TopBar";
import { SnackbarContext, Snackbar } from "../Snackbar";
import NumberInput from "../NumberInput";

export default function SettingsPage(): React.ReactElement {
    const api = useContext(ApiContext);
    const snackbar = useContext(SnackbarContext);
    const [settings, setSettings] = useState<Settings>(emptySettings);

    useEffect(() => {
        const fetchSettings = async (): Promise<void> => {
            const result = await api.settings.load();
            setSettings(result);
        };
        fetchSettings();
    }, []);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const update = async (): Promise<void> => {
            await api.settings.update(settings);
            snackbar.show(<Snackbar text="Settings saved" />);
        };
        update();
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
                        <NumberInput
                            name="targetCalories"
                            decimal={false}
                            value={settings.targetCalories}
                            onChange={(targetCalories) => setSettings((prev) => ({ ...prev, targetCalories }))}
                        />
                        <div className="input-group__suffix">kcal</div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inputTargetFat" className="input-group__label">
                            Fat
                        </label>
                        <NumberInput
                            name="targetFat"
                            decimal={false}
                            value={settings.targetFat}
                            onChange={(targetFat) => setSettings((prev) => ({ ...prev, targetFat }))}
                        />
                        <div className="input-group__suffix">g</div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inputTargetCarbs" className="input-group__label">
                            Carbs
                        </label>
                        <NumberInput
                            name="targetCarbs"
                            decimal={false}
                            value={settings.targetCarbs}
                            onChange={(targetCarbs) => setSettings((prev) => ({ ...prev, targetCarbs }))}
                        />
                        <div className="input-group__suffix">g</div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inputTargetProtein" className="input-group__label">
                            Protein
                        </label>
                        <NumberInput
                            name="targetProtein"
                            decimal={false}
                            value={settings.targetProtein}
                            onChange={(targetProtein) => setSettings((prev) => ({ ...prev, targetProtein }))}
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
