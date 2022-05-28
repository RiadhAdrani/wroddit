import { Column, Div, EmptyBox, H3, H4, Img, Row } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { mediaQueries } from "../../Style";

export default (props) => {
    const theme = getTheme();

    return Column({
        flags: { renderIf: props.show },
        style: {
            className: "by-user-info",
            normal: {
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "2.5px",
                width: "300px",
                animation: "slideDownFading 0.2s",
                boxShadow: `0px 0px 5px 0px ${theme.accent}`,
            },
            mediaQueries: mediaQueries({
                small: { normal: { width: "200px", fontWeight: "0.85em" } },
            }),
        },
        children: [
            Div({
                style: {
                    inline: {
                        height: "75px",
                        backgroundImage: `url(${props.community.banner})`,
                        backgroundColor: theme.tertiary,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        borderRadius: "2.5px",
                    },
                },
            }),
            Row({
                style: {
                    inline: {
                        padding: "5px 10px",
                        backgroundColor: "transparent",
                        alignItems: "center",
                        marginTop: "-10px",
                    },
                },
                children: [
                    Img({
                        src: props.community.picture,
                        alt: props.community.title,
                        height: 50,
                        width: 50,
                        style: {
                            inline: {
                                borderRadius: "50%",
                                border: `3px solid ${theme.primary}`,
                                backgroundColor: theme.secondary,
                            },
                        },
                    }),
                    EmptyBox({ width: "10px" }),
                    Column({
                        style: { inline: { flex: 1 } },
                        children: [
                            EmptyBox({ height: "10px" }),
                            H3({
                                text: props.community.title,
                                style: {
                                    inline: { margin: "0px", padding: "0px" },
                                },
                            }),
                            EmptyBox({ height: "5px" }),
                            H4({
                                text: `w/${props.community.name}`,
                                style: {
                                    inline: { margin: "0px", padding: "0px", fontWeight: 500 },
                                },
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
