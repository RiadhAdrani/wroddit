import { Button, Link } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default ({ text, to }) => {
    const theme = getTheme();

    return Link({
        to,
        children: Button({
            text: text,
            style: {
                className: "standard-button-link",
                normal: {
                    padding: "7.5px",
                    backgroundColor: theme.secondary,
                    border: `1px solid ${theme.accent}`,
                    fontWeight: "bold",
                    borderRadius: "2.5px",
                },
                hover: {
                    cursor: "pointer",
                    backgroundColor: theme.tertiary,
                },
                active: {
                    backgroundColor: theme.accentSecondary,
                },
            },
        }),
    });
};
