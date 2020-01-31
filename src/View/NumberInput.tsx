import React, { useState, useEffect } from "react";

interface NumberInputProps {
    name: string;
    value: number;
    decimal: boolean;
    onChange: (value: number) => void;
    className?: string;
}

export default function NumberInput(props: NumberInputProps): React.ReactElement {
    const format = (x: number) => x.toFixed(props.decimal ? 1 : 0);
    const [value, setValue] = useState<string>(format(props.value));

    useEffect(() => setValue(format(props.value)), [props.value]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const updateValue = (value: string): void => {
        const parsed = props.decimal ? parseFloat(value) : parseInt(value);
        if (isNaN(parsed)) {
            props.onChange(0);
        } else {
            props.onChange(parsed);
        }
    };

    return (
        <input
            className={"input-group__input " + (props.className || "")}
            type="number"
            min="0"
            step={props.decimal ? "0.1" : "1"}
            name="quantity"
            value={value}
            onChange={onChange}
            onBlur={(e) => updateValue(e.target.value)}
            onFocus={(e) => e.target.select}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    updateValue(e.currentTarget.value);
                }
            }}
        />
    );
}
