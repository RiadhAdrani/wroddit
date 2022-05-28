import { Input } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";

export default ({ state, placeholder, type = "text", disabled = false }) => {
    const [value, setValue] = getState(state);
    const theme = getTheme();

    return Input({
        disabled,
        value,
        placeholder,
        type,
        events: {
            onInput: (e) => {
                setValue(e.target.value);
            },
        },
        style: {
            className: "input-field",
            normal: {
                padding: "10px 20px",
                borderRadius: "2.5px",
                border: `1px solid ${theme.accent}`,
            },
            focus: {
                outlineColor: theme.color,
            },
        },
    });
};
