import { Input } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";

export default ({ state, onEnter = () => {}, placeholder = "Enter new item", max = 20 }) => {
    const [value, setValue] = getState(state);

    return Input({
        value,
        maxLength: max,
        placeholder,
        events: {
            onInput: (e) => {
                setValue(e.target.value);
            },
            onKeyPress: (e) => {
                if (e.key == "Enter") {
                    onEnter(e);
                }
            },
        },
        style: {
            className: "standard-array-input",
            normal: {
                padding: "5px 0px",
                margin: "0px",
                border: "none",
            },
            focus: { outline: "none" },
        },
    });
};
