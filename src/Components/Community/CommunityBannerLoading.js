import { Column, Div, Row, Img, EmptyBox } from "@riadh-adrani/recursive/components";
import { getGradient, getTheme } from "../../Models/Theme";

export default () => {
    const theme = getTheme();

    return Column({
        style: { className: "community-banner", normal: { marginBottom: "10px" } },
        children: [
            Div({
                className: "loading-gradient",
                style: {
                    inline: {
                        height: "144px",
                        backgroundImage: getGradient(),
                    },
                },
            }),
            Row({
                style: {
                    className: "u-banner",
                    normal: {
                        marginTop: "-10px",
                        paddingLeft: "50px",
                        paddingBottom: "15px",
                        borderBottom: `1px solid ${theme.accent}`,
                        backgroundColor: "transparent",
                    },
                },
                children: [
                    Div({
                        className: "loading-gradient",
                        style: {
                            className: "community-picture",
                            normal: {
                                borderRadius: "50%",
                                boxShadow: `0px 0px 1px ${theme.accentTertiary}`,
                                backgroundImage: getGradient(),
                                height: "80px",
                                width: "80px",
                            },
                        },
                    }),
                    Column({
                        style: {
                            className: "c-titles",
                            normal: {
                                marginTop: "25px",
                                paddingLeft: "20px",
                            },
                        },
                        children: [
                            Column({
                                children: [
                                    Div({
                                        className: "loading-gradient",
                                        style: {
                                            inline: {
                                                height: "1em",
                                                width: "150px",
                                                backgroundImage: getGradient(),
                                            },
                                        },
                                    }),
                                    EmptyBox({ height: "10px" }),
                                    Div({
                                        className: "loading-gradient",
                                        style: {
                                            inline: {
                                                height: "0.8em",
                                                width: "80px",
                                                backgroundImage: getGradient(),
                                            },
                                        },
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
