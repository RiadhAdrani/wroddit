import { Column, EmptyBox, H5, Img, P, Row, Span } from "@riadh-adrani/recursive/components";
import { getState, setState } from "@riadh-adrani/recursive/state";
import {
    downVoteComment,
    getCommentData,
    removeDownVoteComment,
    removeUpVoteComment,
    upVoteComment,
} from "../../Models/Cloud";
import { getTheme } from "../../Models/Theme";
import { setUserState, since } from "../../Models/Utility";
import { userState } from "../../StateManagement/StateManager";
import { mediaQueries } from "../../Style";
import CreateReply from "../CreateReply/CreateReply";
import Reply from "../Reply/Reply";
import StandardTextButton from "../Standard/StandardTextButton";
import StandardVoteButton from "../Standard/StandardVoteButton";
import CommentLoadingView from "./CommentLoadingView";
import CommentUser from "./CommentUser";

export default (post, comment) => {
    const theme = getTheme();
    const path = `posts/${post.uid}/comments/${comment.uid}`;

    const [current] = getState("user");
    const [user] = userState(comment.user);
    const [busy, setBusy] = setState(`comment-${comment.uid}-is-busy`, false);
    const [showReplies, setShowReplies] = setState(`comment-${comment.uid}-show-replies`, false);
    const [edit, setEdit] = setState(`comment-${comment.uid}-edit-reply`, false);
    const [data, setData] = setState(`comment-${comment.uid}`, { isLoading: true }, async () => {
        const res = await getCommentData(path, comment.uid);

        setData({ isLoading: false, ...res });
    });

    async function upVote() {
        const is = data.up.find((item) => item.user == current.email);

        setBusy(true);

        if (is) {
            await removeUpVoteComment(current.email, path);
            data.up.filter((item) => {
                item.user != current.email;
            });
            setData(data);
        } else {
            await upVoteComment(current.email, path);
            data.down = data.down.filter((item) => item.user != current.email);
            data.up = [...data.up, { date: Date.now(), user: current.email }];
            setData(data);
        }

        setBusy(false);
    }

    async function downVote() {
        const is = data.down.find((item) => item.user == current.email);

        setBusy(true);

        if (is) {
            await removeDownVoteComment(current.email, path);
            data.down.filter((item) => {
                item.user != current.email;
            });
            setData(data);
        } else {
            await downVoteComment(current.email, path);
            data.up = data.up.filter((item) => item.user != current.email);
            data.down = [...data.down, { date: Date.now(), user: current.email }];
            setData(data);
        }

        setBusy(false);
    }

    return data.isLoading
        ? CommentLoadingView(comment.uid)
        : Column({
              id: comment.uid,
              style: {
                  className: "comment-view",
                  normal: {
                      borderLeft: `1.5px solid ${theme.accentSecondary}`,
                      marginTop: "2em",
                      marginBottom: "5px",
                  },
              },
              children: [
                  Row({
                      style: {
                          inline: {
                              marginTop: "-2em",
                              marginLeft: "-2px",
                              fontWeight: 500,
                              alignItems: "center",
                          },
                      },
                      children: [
                          Img({
                              src: user.picture,
                              height: 20,
                              width: 20,
                              style: {
                                  className: "comment-top",
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
                                  CommentUser({ comment, user }),
                                  Span({
                                      text: ` · ${since(comment.created)} ago`,
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
                          className: "comment-offset",
                          normal: { marginLeft: "15px" },
                          mediaQueries: mediaQueries({
                              smaller: { normal: { marginLeft: "10px" } },
                          }),
                      },
                      children: [
                          P({ text: comment.text }),
                          EmptyBox({ height: "10px" }),
                          Row({
                              style: { inline: { alignItems: "center" } },
                              children: [
                                  StandardVoteButton({
                                      text: "up",
                                      loading: busy,
                                      onClick: upVote,
                                  }),
                                  EmptyBox({ width: "5px" }),
                                  P({
                                      text: data.up.length - data.down.length,
                                  }),
                                  EmptyBox({ width: "5px" }),
                                  StandardVoteButton({
                                      text: "down",
                                      loading: busy,
                                      onClick: downVote,
                                  }),
                                  StandardTextButton({
                                      text: "Reply",
                                      onClick: () => setEdit(!edit),
                                      style: { marginLeft: "10px" },
                                  }),
                                  data.replies.length == 0
                                      ? ""
                                      : StandardTextButton({
                                            text: showReplies
                                                ? "Hide replies"
                                                : `Show replies (${data.replies.length})`,
                                            onClick: () => {
                                                setShowReplies(!showReplies);
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
                      children: [
                          CreateReply(
                              `posts/${post.uid}`,
                              "comments",
                              "replies",
                              comment.uid,
                              (newComment) => {
                                  data.replies = [...data.replies, newComment];
                                  setData(data);
                              }
                          ),
                      ],
                  }),
                  !showReplies
                      ? ""
                      : Column({
                            style: { inline: { marginLeft: "20px", marginTop: "5px" } },
                            children: data.replies.map((reply) => {
                                const p = `${path}/replies/${reply.uid}`;

                                return Reply(reply, p, 1);
                            }),
                        }),
              ],
          });
};
