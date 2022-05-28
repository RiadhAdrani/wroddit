import { Column, H3, P, Row, Span } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { since } from "../../Models/Utility";
import { mediaQueries } from "../../Style";

export default (controller, showAtLowResolution = false) => {
    const theme = getTheme();

    return Column({
        style: {
            className: "community-about",
            scoped: true,
            normal: {
                minWidth: "300px",
                maxWidth: "300px",
                padding: "10px",
                display: showAtLowResolution ? "none" : "flex",
                border: `1px solid ${theme.accent}`,
                marginLeft: "10px",
                alignSelf: "flex-start",
                borderRadius: "2.5px",
            },
            mediaQueries: mediaQueries({
                small: {
                    normal: {
                        display: showAtLowResolution ? "flex" : "none",
                        marginLeft: "0px",
                        minWidth: "auto",
                        width: "auto",
                        maxWidth: "100%",
                        marginBottom: "10px",
                        alignSelf: "stretch",
                    },
                },
            }),
        },
        children: [
            H3({
                text: "About the community",
                style: {
                    inline: {
                        borderBottom: `1px solid ${theme.tertiary}`,
                        marginBottom: "10px",
                        paddingBottom: "10px",
                    },
                },
            }),
            P({
                text: controller.community.description,
                style: {
                    inline: {
                        borderBottom: `1px solid ${theme.tertiary}`,
                        marginBottom: "10px",
                        paddingBottom: "10px",
                        color: theme.accentTertiary,
                    },
                },
            }),
            P({
                text: `Joined by ${controller.data.users.length} ${
                    controller.data.users.length > 1 ? "users" : "user"
                }`,
                style: {
                    inline: {
                        borderBottom: `1px solid ${theme.tertiary}`,
                        marginBottom: "10px",
                        paddingBottom: "10px",
                        color: theme.accentTertiary,
                    },
                },
            }),
            Row({
                style: {
                    className: "community-tags",
                    normal: {
                        flexWrap: "wrap",
                        paddingBottom: "10px",
                        marginBottom: "10px",
                        borderBottom: `1px solid ${theme.tertiary}`,
                    },
                },
                children: controller.community.tags.map((tag) =>
                    Span({
                        text: tag,
                        style: {
                            className: "community-tag",
                            normal: {
                                padding: "5px 10px",
                                background: theme.secondary,
                                border: `1px solid ${theme.accent}`,
                                borderRadius: "5px",
                                marginRight: "3.5px",
                                marginBottom: "3.5px",
                                fontSize: "0.85em",
                            },
                        },
                    })
                ),
            }),
            P({
                text: controller.community.created
                    ? `Created ${new Date(
                          parseInt(controller.community.created)
                      ).toLocaleDateString()} • ${since(controller.community.created)} ago`
                    : "Unknown",
                style: {
                    inline: {
                        color: theme.accentTertiary,
                        fontWeight: "bold",
                    },
                },
            }),
        ],
    });
};
