import { Column, Div, H3, P } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { since } from "../../Models/Utility";
import { mediaQueries } from "../../Style";

export default (props) => {
    const theme = getTheme();

    const zIndex = props.zIndex || "auto";

    return Column({
        flags: { renderIf: props.show },
        style: {
            className: "by-user-info",
            scoped: true,
            normal: {
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "2.5px",
                width: "200px",
                animation: "slideDownFading 0.2s",
                zIndex,
                boxShadow: `0px 0px 5px 0px ${theme.accent}`,
            },
            mediaQueries: mediaQueries({
                small: { normal: { width: "150px", fontSize: "0.85em" } },
            }),
        },
        children: [
            Div({
                style: {
                    inline: {
                        height: "75px",
                        backgroundImage: `url(${props.user.banner})`,
                        backgroundColor: theme.tertiary,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        borderRadius: "2.5px",
                    },
                },
            }),
            Column({
                style: {
                    inline: { padding: "5px 10px", marginBottom: "10px", borderRadius: "2.5px" },
                },
                children: [
                    H3({ text: `u/${props.user.username}` }),
                    P({ text: `Joined Wroddit ${since(props.user.joined)} ago` }),
                ],
            }),
        ],
    });
};
