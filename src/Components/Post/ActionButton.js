import { Button } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default (text) => {
    const theme = getTheme();

    return Button({
        text,
        style: {
            className: "action-button",
            normal: {
                background: "transparent",
                border: "none",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "0.75em",
                color: theme.accentTertiary,
            },
            hover: {
                background: theme.tertiary,
            },
        },
    });
};
