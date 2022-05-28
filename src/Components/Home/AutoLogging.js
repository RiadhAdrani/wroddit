import { BorderSpinner, Column, EmptyBox, H3, Img } from "@riadh-adrani/recursive/components";
import { getLogo, getTheme } from "../../Models/Theme";

export default (show) => {
    const theme = getTheme();

    return Column({
        flags: { renderIf: show },
        style: {
            inline: {
                position: "fixed",
                inset: "0px",
                zIndex: 5,
                alignItems: "center",
                justifyContent: "center",
            },
        },
        children: [
            Img({ src: getLogo(), width: 100, height: 100 }),
            EmptyBox({ height: "20px" }),
            H3({ text: "Logging in ...", style: { inline: { fontWeight: "normal" } } }),
            EmptyBox({ height: "10px" }),
            BorderSpinner({ color: theme.accentTertiary, size: "40px" }),
        ],
    });
};
