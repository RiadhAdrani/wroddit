import { Column, Div, EmptyBox, H3, Img, P, Row, Span } from "@riadh-adrani/recursive/components";
import { getRoute, goTo } from "@riadh-adrani/recursive";
import { goToPost } from "../../Models/Utility";
import ActionButton from "./ActionButton";
import VoteButton from "./VoteButton";
import { since } from "../../Models/Utility";
import { getParams } from "@riadh-adrani/recursive/router";
import StandardIcon from "../Standard/StandardIcon";
import { getTheme } from "../../Models/Theme";
import PostUser from "./PostUser";
import PostCommunity from "./PostCommunity";

export default (controller) => {
    const theme = getTheme();

    return Row({
        style: {
            className: "post-card-view",
            normal: {
                border: `1px solid ${theme.accent}`,
                marginBottom: "10px",
                borderRadius: "2.5px",
            },
            hover: { borderColor: theme.accentSecondary },
        },
        children: [
            Column({
                style: {
                    className: "post-votes",
                    normal: {
                        alignItems: "center",
                        padding: "10px",
                        backgroundColor: theme.secondary,
                    },
                },
                children: [
                    VoteButton({
                        text: "up",
                        loading: controller.busy,
                        onClick: controller.onUpVoteClicked,
                        on: controller.hasUserUpVoted(),
                    }),
                    EmptyBox({ height: "5px" }),
                    Div({ children: controller.up.length - controller.down.length }),
                    EmptyBox({ height: "5px" }),
                    VoteButton({
                        text: "down",
                        loading: controller.busy,
                        onClick: controller.onDownVoteClicked,
                        on: controller.hasUserDownVoted(),
                    }),
                ],
            }),
            Column({
                style: {
                    className: "post-content",
                    normal: {
                        padding: "12px 10px 0px 10px",
                        flex: 1,
                        borderLeft: `1px solid ${theme.accent}`,
                        cursor: "pointer",
                    },
                },
                events: {
                    onClick: () => {
                        if (getParams().post) return;

                        if (getRoute() == "/") goTo(`/post=:${controller.post.uid};`);
                        else {
                            goToPost(controller.community.name, controller.post.uid);
                        }
                    },
                },
                children: [
                    Row({
                        style: { inline: { alignItems: "center" } },
                        children: [
                            Img({
                                src: controller.community.picture,
                                alt: controller.post.title,
                                height: 20,
                                width: 20,
                                style: {
                                    inline: {
                                        borderRadius: "50%",
                                        marginRight: "5px",
                                        border: `1px solid ${theme.accent}`,
                                    },
                                },
                            }),
                            P({
                                style: {
                                    className: "post-top",
                                    normal: {
                                        margin: "0px",
                                        fontSize: "0.8em",
                                        fontWeight: 600,
                                        color: theme.accentTertiary,
                                    },
                                },
                                text: [
                                    PostCommunity({
                                        post: controller.post,
                                        community: controller.community,
                                    }),
                                    Span({
                                        text: ` • Posted ${since(controller.post.created)} ago by `,
                                    }),
                                    PostUser({ post: controller.post, user: controller.user }),
                                ],
                            }),
                        ],
                    }),

                    EmptyBox({ height: "5px" }),
                    H3({ text: controller.post.title, style: { inline: { fontSize: "1.5em" } } }),
                    EmptyBox({ height: "10px" }),
                    P({
                        style: {
                            className: "post-text",
                            normal: {
                                margin: "0px",
                                fontSize: "1em",
                                whiteSpace: "break-spaces",
                            },
                        },
                        text: controller.text(),
                    }),
                    Img({
                        src: controller.post.media,
                        flags: { renderIf: controller.post.media != undefined },
                        loading: "lazy",
                        style: {
                            inline: {
                                width: "100%",
                                height: "auto",
                                marginTop: "10px",
                                borderRadius: "2.5px",
                            },
                        },
                    }),
                    EmptyBox({ flags: { renderIf: !controller.showBottomBar }, height: "20px" }),
                    Row({
                        flags: { renderIf: controller.showBottomBar },
                        style: {
                            className: "post-comments",
                            normal: {
                                marginTop: "20px",
                                borderTop: `1px solid ${theme.accent}`,
                                justifyContent: "flex-end",
                            },
                        },
                        children: [
                            ActionButton([
                                StandardIcon({
                                    fa: "fa-solid fa-comment-dots",
                                    style: { normal: { marginRight: "5px" } },
                                }),
                                `Comments (${controller.comments.length})`,
                            ]),
                            // EmptyBox({ width: "10px" }),
                            // ActionButton([
                            //     StandardIcon({
                            //         fa: "fa-solid fa-share",
                            //         style: { normal: { marginRight: "5px" } },
                            //     }),
                            //     "Share",
                            // ]),
                        ],
                    }),
                ],
            }),
        ],
    });
};
