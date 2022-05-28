import { Column, Row, Img, Div } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import { setCommunityState } from "../../Models/Utility";
import { mediaQueries } from "../../Style";
import JoinButton from "./CommunityJoinButton";
import Name from "./CommunityName";
import Title from "./CommunityTitle";

export default (controller) => {
    const theme = getTheme();

    return Column({
        style: {
            className: "community-banner",
            normal: { marginBottom: "10px" },
        },
        children: [
            Div({
                style: {
                    inline: {
                        height: "144px",
                        backgroundImage: `url(${controller.community.banner})`,
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
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
                    mediaQueries: mediaQueries({
                        smaller: {
                            normal: {
                                paddingLeft: "0px",
                                alignItems: "center",
                                textAlign: "center",
                                width: "100%",
                                flexDirection: "column",
                            },
                        },
                    }),
                },
                children: [
                    Img({
                        src: controller.community.picture,
                        height: 80,
                        width: 80,
                        style: {
                            className: "community-picture",
                            normal: {
                                background: theme.secondary,
                                borderRadius: "50%",
                                border: `5px solid ${theme.primary}`,
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
                            mediaQueries: mediaQueries({
                                smaller: { normal: { marginTop: "5px", paddingLeft: "0px" } },
                            }),
                        },
                        children: [
                            Row({
                                style: {
                                    className: "title-and-join",
                                    mediaQueries: mediaQueries({
                                        smaller: {
                                            normal: {
                                                flexDirection: "column",
                                                marginBottom: "10px",
                                                alignSelf: "center",
                                            },
                                        },
                                    }),
                                },
                                children: [Title(controller), JoinButton(controller)],
                            }),
                            Name(controller),
                        ],
                    }),
                ],
            }),
        ],
    });
};
