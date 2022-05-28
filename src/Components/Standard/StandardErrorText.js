import { I, P } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import StandardIcon from "./StandardIcon";

export default (text, style = {}) => {
    const theme = getTheme();

    return P({
        flags: { renderIf: text != "" },
        text: [StandardIcon({ fa: "fa-solid fa-triangle-exclamation" }), " ", text],
        style: {
            className: "standard-error-text",
            scoped: true,
            normal: {
                color: theme.text,
                background: theme.secondary,
                fontWeight: 500,
                fontSize: "0.9em",
                padding: "10px",
                borderRadius: "2.5px",
                border: `1px solid ${theme.accent}`,
                ...style,
            },
        },
    });
};
