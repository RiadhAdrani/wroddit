import { P } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default ({ text, onClick = () => {}, style = {}, renderIf = true, busy = false }) => {
    const theme = getTheme();

    return P({
        flags: { renderIf },
        text,
        events: {
            onClick: () => {
                if (!busy) onClick();
            },
        },
        style: {
            className: "standard-text-button",
            scoped: true,
            normal: {
                margin: "0px",
                fontSize: "0.8em",
                color: theme.accentTertiary,
                cursor: "pointer",
                ...style,
            },
            hover: {
                textDecoration: "underline",
            },
        },
    });
};
