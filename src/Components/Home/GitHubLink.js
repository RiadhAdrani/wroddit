import { A } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import StandardIcon from "../Standard/StandardIcon";

export default () => {
    const theme = getTheme();

    return A({
        href: "https://github.com/RiadhAdrani/wroddit",
        target: "blank",
        style: {
            inline: {
                position: "fixed",
                bottom: "15px",
                right: "15px",
                zIndex: 10,
                border: `1px solid ${theme.accent}`,
                borderRadius: "50%",
                height: "50px",
                width: "50px",
                fontSize: "25px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                boxShadow: `0px 0px 3px 0px ${theme.accent}`,
            },
        },
        children: StandardIcon({ fa: "fa-brands fa-github" }),
    });
};
