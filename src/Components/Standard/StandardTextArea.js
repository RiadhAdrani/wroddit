import { Column, TextArea } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import StandardMaxCharacters from "./StandardMaxCharacters";

export default ({ state, placeholder, busy, max = 1000 }) => {
    const [value, setValue] = getState(state);
    const theme = getTheme();

    return Column({
        children: [
            TextArea({
                disabled: busy,
                placeholder,
                value: value.slice(0, max),
                maxLength: max,
                events: {
                    onInput: (e) => {
                        setValue(e.target.value);
                    },
                },
                style: {
                    className: "standard-text-area",
                    normal: {
                        padding: "10px 20px",
                        borderColor: theme.accent,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderRadius: "2.5px",
                        resize: "vertical",
                    },
                    focus: {
                        outlineColor: theme.color,
                    },
                },
            }),
            StandardMaxCharacters(value.length, max, { marginTop: "5px", marginLeft: "auto" }),
        ],
    });
};
