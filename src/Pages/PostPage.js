import { Column, EmptyBox, H2, Row, Span } from "@riadh-adrani/recursive/components";
import { getParams, setTitle } from "@riadh-adrani/recursive/router";
import { setCache, updateAfter } from "@riadh-adrani/recursive/state";
import { getTheme } from "../Models/Theme";
import { goToCommunity } from "../Models/Utility";
import PostCardView from "../Components/Post/PostCardView";
import SortComments from "../Components/Post/SortComments";
import CommentSection from "../Components/Post/CommentSection";
import StandardButton from "../Components/Standard/StandardButton";
import StandardIcon from "../Components/Standard/StandardIcon";
import CreateReply from "../Components/CreateReply/CreateReply";
import PostPageLoading from "../Components/Post/PostPageLoading";
import { getPostInfo } from "../Models/Cloud";
import PostController from "../Models/PostController";
import { mediaQueries } from "../Style";
import PostNotFound from "../Components/Post/PostNotFound";

export default () => {
    const uid = getParams().post;

    const theme = getTheme();

    const [postRef, setPostRef] = setCache(`post-ref-${uid}`, null, async () => {
        const ref = await getPostInfo(uid);

        updateAfter(() => {
            setPostRef(ref.exists() ? { uid: ref.id, ...ref.data() } : { notFound: true });
        });
    });

    setTitle(`${postRef && postRef.title ? postRef.title : "Post"} | Wroddit`);

    let controller = null;

    if (postRef && !postRef.notFound) {
        controller = PostController({
            uid: postRef.uid,
            communityUid: postRef.community,
            userUid: postRef.user,
            showBottomBar: false,
        });
    }

    const loading = !controller || controller.isLoading();
    const notFound = postRef && postRef.notFound;

    return Column({
        style: {
            className: "post-page",
            normal: {
                background: theme.secondary,
                position: getParams().community ? "fixed" : "relative",
                inset: getParams().community ? "50px 0px 0px 0px" : "",
                background: getParams().community ? "inherit" : theme.primary,
                overflowY: getParams().community ? "auto" : "none",
                padding: "20px 0px",
                minHeight: "calc(100vh - 50px)",
                zIndex: 1,
            },
        },
        events: {
            onClick: () => {
                if (getParams().community) {
                    goToCommunity(getParams().community);
                }
            },
        },
        children:
            loading && !notFound
                ? PostPageLoading()
                : notFound
                ? PostNotFound()
                : [
                      Column({
                          style: {
                              className: "post-page-box",
                              normal: {
                                  maxWidth: "1000px",
                                  minWidth: "1000px",
                                  alignSelf: "center",
                                  background: theme.primary,
                                  border: `1px solid ${theme.accent}`,
                                  padding: "30px",
                                  borderRadius: "2.5px",
                              },
                              mediaQueries: mediaQueries({
                                  medium: {
                                      normal: {
                                          maxWidth: "800px",
                                          minWidth: "800px",
                                          marginLeft: "10px",
                                          marginRight: "10px",
                                      },
                                  },
                                  small: {
                                      normal: {
                                          maxWidth: "calc(100vw - 30px)",
                                          minWidth: "calc(100vw - 30px)",
                                          marginLeft: "10px",
                                          marginRight: "10px",
                                          padding: "10px",
                                      },
                                  },
                              }),
                          },
                          events: {
                              onClick: (e) => {
                                  e.stopPropagation();
                              },
                          },
                          children: [
                              Row({
                                  style: {
                                      className: "post-page-heading",
                                      normal: { justifyContent: "space-between" },
                                      mediaQueries: mediaQueries({
                                          small: { normal: { flexDirection: "column" } },
                                      }),
                                  },
                                  children: [
                                      H2({
                                          style: {
                                              inline: {
                                                  display: "flex",
                                                  alignItems: "center",
                                                  display: "flex",
                                                  flexWrap: "wrap",
                                              },
                                          },
                                          text: [
                                              Span({ text: controller.community.title }),
                                              EmptyBox({ width: "10px" }),
                                              Span({
                                                  text: `w/${controller.community.name}`,
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
                                      StandardButton({
                                          text: [
                                              StandardIcon({
                                                  fa: "fa-solid fa-circle-xmark",
                                              }),
                                              getParams().community ? " Close" : " Go to community",
                                          ],
                                          onClick: () => {
                                              goToCommunity(controller.community.name);
                                          },
                                      }),
                                  ],
                              }),
                              EmptyBox({ height: "10px" }),
                              Row({
                                  children: [
                                      Column({
                                          style: {
                                              inline: {
                                                  flex: 1,
                                              },
                                          },
                                          children: [
                                              PostCardView(controller),
                                              SortComments(controller),
                                              CreateReply(
                                                  "",
                                                  "posts",
                                                  "comments",
                                                  controller.post.uid,
                                                  (newComment) => controller.addComment(newComment)
                                              ),
                                              CommentSection(controller),
                                          ],
                                      }),
                                  ],
                              }),
                          ],
                      }),
                  ],
    });
};
