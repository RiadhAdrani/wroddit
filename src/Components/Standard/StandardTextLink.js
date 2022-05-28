import { Link } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default ({ text, to }) => {
    const theme = getTheme();

    return Link({
        children: text,
        to,
        style: {
            className: "standard-text-link",
            normal: { textAlign: "center", color: theme.accentTertiary },
        },
    });
};
