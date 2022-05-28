import { BorderSpinner, Button, Row, Span } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

export default ({ text, onClick, disabled = false, loading = false, render = true }) => {
    const theme = getTheme();

    return Button({
        flags: { renderIf: render },
        text: loading
            ? Row({
                  style: { inline: { justifyContent: "center" } },
                  children: BorderSpinner({
                      color: theme.accentTertiary,
                      thickness: "2px",
                      size: "1em",
                  }),
              })
            : text,
        disabled,
        events: { onClick },
        style: {
            className: "standard-button",
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
            disabled: {
                backgroundColor: theme.accent,
            },
        },
    });
};
