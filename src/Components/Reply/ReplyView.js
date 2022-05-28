import { Column, H5, Span, EmptyBox, P, Row, Img } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { since } from "../../Models/Utility";
import { mediaQueries } from "../../Style";
import CommentUser from "../Comment/CommentUser";
import CreateReply from "../CreateReply/CreateReply";
import StandardTextButton from "../Standard/StandardTextButton";
import StandardVoteButton from "../Standard/StandardVoteButton";
import Reply from "./Reply";

export default (reply, user, show, edit, level, actions) => {
    const theme = getTheme();

    return Column({
        id: reply.uid,
        style: {
            className: "reply-view",
            normal: { borderLeft: `1.5px solid ${theme.accentTertiary}`, marginTop: "2em" },
        },
        children: [
            Row({
                style: { inline: { marginTop: "-2em", marginLeft: "-2px" } },
                children: [
                    Img({
                        src: user.picture,
                        height: 20,
                        width: 20,
                        style: {
                            className: "reply-top",
                            normal: {
                                borderRadius: "50%",
                                marginTop: "auto",
                                marginBottom: "auto",
                                marginRight: "5px",
                                marginLeft: "-8px",
                            },
                        },
                    }),
                    H5({
                        text: [
                            CommentUser({ user: user, comment: reply }),
                            Span({
                                text: ` · ${since(reply.created)} ago`,
                                style: {
                                    inline: {
                                        fontSize: "0.8em",
                                        fontWeight: "normal",
                                        color: theme.accentTertiary,
                                    },
                                },
                            }),
                        ],
                    }),
                ],
            }),
            EmptyBox({ height: "5px" }),
            Column({
                style: {
                    className: "reply-offset",
                    normal: { marginLeft: "15px" },
                    mediaQueries: mediaQueries({
                        smaller: { normal: { marginLeft: "10px" } },
                    }),
                },
                children: [
                    P({ style: { inline: { whiteSpaces: "break" } }, text: reply.text }),
                    EmptyBox({ height: "10px" }),
                    Row({
                        style: { inline: { alignItems: "center" } },
                        children: [
                            StandardVoteButton({
                                text: "up",
                                loading: reply.busy,
                                onClick: actions.upVote,
                            }),
                            EmptyBox({ width: "5px" }),
                            P({
                                text: reply.up.length - reply.down.length,
                            }),
                            EmptyBox({ width: "5px" }),
                            StandardVoteButton({
                                text: "down",
                                loading: reply.busy,
                                onClick: actions.downVote,
                            }),
                            level >= 10
                                ? ""
                                : StandardTextButton({
                                      text: "Reply",
                                      onClick: () => {
                                          actions.edit();
                                      },
                                      style: { marginLeft: "10px" },
                                  }),
                            reply.replies.length == 0
                                ? ""
                                : level >= 10
                                ? ""
                                : StandardTextButton({
                                      text: show
                                          ? "Hide replies"
                                          : `Show replies (${reply.replies.length})`,
                                      onClick: () => {
                                          actions.toggleShow();
                                      },
                                      style: { marginLeft: "10px" },
                                  }),
                        ],
                    }),
                ],
            }),
            Column({
                flags: { renderIf: edit },
                style: { inline: { marginLeft: "15px", marginTop: "10px" } },
                children: CreateReply(reply.path, "replies", "replies", reply.uid, actions.reply),
            }),
            !show
                ? ""
                : Column({
                      style: { inline: { marginLeft: "20px", marginTop: "10px" } },
                      children: reply.replies.map((item) => {
                          const path = `${reply.path}/replies/${reply.uid}/replies/${item.uid}`;

                          return Reply(item, path, level + 1);
                      }),
                  }),
        ],
    });
};
