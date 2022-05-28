import { Input } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";

export default ({
    state,
    placeholder,
    type = "text",
    disabled = false,
    max = "",
    onInput = () => {},
    onFocus = () => {},
    onBlur = () => {},
}) => {
    const [value, setValue] = getState(state);
    const theme = getTheme();

    return Input({
        disabled,
        value,
        placeholder,
        type,
        maxLength: max,
        events: {
            onInput: (e) => {
                setValue(e.target.value);
                onInput(e);
            },
            onFocus,
            onBlur,
        },
        style: {
            className: "text-field",
            normal: {
                padding: "10px 20px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "2.5px",
            },
            focus: {
                outlineColor: theme.color,
            },
        },
    });
};
