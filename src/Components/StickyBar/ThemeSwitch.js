import { Div, EmptyBox, I, P, Row } from "@riadh-adrani/recursive/components";
import { getState, setState } from "@riadh-adrani/recursive/state";
import { getTheme, Themes } from "../../Models/Theme";
import { mediaQueries } from "../../Style";
import StandardButton from "../Standard/StandardButton";

export default () => {
    const theme = getTheme();

    const [toggle, setToggle] = setState("theme-toggle", theme.name == "dark");

    return StandardButton({
        onClick: () => {
            const [, setCurrent] = getState("theme");

            setCurrent(toggle ? Themes.Light : Themes.Dark);
            setToggle(!toggle);
        },
        text: Row({
            style: {
                inline: {
                    alignItems: "center",
                    cursor: "pointer",
                },
            },
            children: [
                P({
                    text: toggle ? "Dark" : "Light",
                    style: {
                        inline: {
                            fontWeight: "bold",
                            fontSize: "0.8em",
                        },
                        className: "theme-text",
                        mediaQueries: mediaQueries({ small: { normal: { display: "none" } } }),
                    },
                }),
                EmptyBox({ width: "5px" }),
                Div({
                    style: {
                        className: "toggle",
                        scoped: true,
                        normal: {
                            position: "relative",
                            width: "40px",
                            height: "20px",
                            borderRadius: "20px",
                            border: `1px solid ${theme.accent}`,
                            background: theme.secondary,
                            transition: "0.5s",
                            boxShadow: "inset 0 8px 6px rgba(0,0,0,0.1)",
                        },
                    },
                    children: I({
                        style: {
                            className: "indicator",
                            scoped: true,
                            normal: {
                                position: "absolute",
                                top: "-1px",
                                left: toggle ? "20px" : 0,
                                width: "20px",
                                height: "20px",
                                background: theme.accentSecondary,
                                borderRadius: "50%",
                                transform: "scale(0.9)",
                                transition: "0.5s",
                                boxShadow: "0 8px 6px rgba(0,0,0,0.1)",
                            },
                        },
                    }),
                }),
            ],
        }),
    });
};
