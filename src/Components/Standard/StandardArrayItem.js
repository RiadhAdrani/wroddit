import { Span } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default ({ text, onClick = () => {} }) => {
    const theme = getTheme();

    return Span({
        text,
        events: { onClick },
        style: {
            className: "clickable-item",
            normal: {
                padding: "5px",
                marginRight: "3px",
                marginBottom: "3px",
                background: theme.tertiary,
                borderRadius: "2.5px",
                border: `1px solid ${theme.secondary}`,
                cursor: "pointer",
            },
            hover: {
                background: theme.accentSecondary,
            },
        },
    });
};
