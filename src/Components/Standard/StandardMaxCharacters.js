import { Span } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default (current, max, style = {}) => {
    const theme = getTheme();

    return Span({
        text: `${current}/${max}`,
        style: {
            className: "standard-max-character",
            scoped: true,
            normal: { fontSize: "0.7em", color: theme.accentTertiary, ...style },
        },
    });
};
