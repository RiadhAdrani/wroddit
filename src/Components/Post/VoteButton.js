import { BorderSpinner, Button } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { checkUser } from "../../Models/Utility";
import StandardIcon from "../Standard/StandardIcon";

export default ({ text, onClick = () => {}, loading = false, on = false }) => {
    const theme = getTheme();

    return Button({
        text: loading
            ? BorderSpinner({ color: theme.accentTertiary, size: "0.7em", thickness: "2px" })
            : StandardIcon({
                  fa: text == "up" ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down",
              }),
        events: {
            onClick: () => {
                checkUser(onClick);
            },
        },
        disabled: loading,
        style: {
            className: "vote-button",
            scoped: true,
            normal: {
                minHeight: "2em",
                maxHeight: "2em",
                maxWidth: "2em",
                minWidth: "2em",
                background: on ? theme.accentTertiary : "tranparent",
                border: `1px solid ${theme.accent}`,
                color: on ? theme.secondary : theme.accentTertiary,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2.5px",
                cursor: "pointer",
            },
            hover: {
                background: on ? theme.accent : theme.tertiary,
            },
            active: {
                background: on ? theme.accentSecondary : theme.accent,
            },
            disabled: {
                backgroundColor: theme.primary,
            },
        },
    });
};
