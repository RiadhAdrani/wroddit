import { Column, EmptyBox, LazyColumn, Row } from "@riadh-adrani/recursive/components";
import { getParams, renderRoute } from "@riadh-adrani/recursive/router";
import CommunityAbout from "../Components/Community/CommunityAbout";
import Banner from "../Components/Community/CommunityBanner";
import CreatePost from "../Components/Community/CommunityCreatePost";
import CommunityLoading from "../Components/Community/CommunityLoading";
import NotFound from "../Components/Community/CommunityNotFound";
import PostCard from "../Components/Post/PostCard";
import SortPosts from "../Components/Community/CommunitySortPosts";
import CommunityController from "../Models/CommunityController";
import { mediaQueries } from "../Style";

export default () => {
    const uid = getParams().community;

    const controller = CommunityController(uid);

    return controller.isLoading()
        ? CommunityLoading()
        : controller.community.notFound
        ? NotFound()
        : Column({
              children: [
                  Banner(controller),
                  Row({
                      style: {
                          className: "divider",
                          normal: {
                              marginTop: "20px",
                              marginLeft: "auto",
                              marginRight: "auto",
                              maxWidth: "1000px",
                              minWidth: "1000px",
                          },
                          mediaQueries: mediaQueries({
                              medium: { normal: { maxWidth: "800px", minWidth: "800px" } },
                              small: {
                                  normal: {
                                      maxWidth: "calc(100vw - 20px)",
                                      minWidth: "calc(100vw - 20px)",
                                      marginLeft: "auto",
                                      marginRight: "auto",
                                      marginTop: "10px",
                                  },
                              },
                          }),
                      },
                      children: [
                          Column({
                              style: { className: "slim-feed-wrapper", normal: { flex: 1 } },
                              children: [
                                  CommunityAbout(controller, true),
                                  CreatePost(controller),
                                  SortPosts(controller),
                                  LazyColumn({
                                      onObserved: controller.loadMorePosts,
                                      style: {
                                          className: "community-posts",
                                          normal: { marginTop: "0px" },
                                      },
                                      children: controller
                                          .postsToDisplay()
                                          .map((post) => PostCard({ post: post })),
                                  }),
                              ],
                          }),
                          CommunityAbout(controller),
                      ],
                  }),
                  renderRoute(),
              ],
          });
};
