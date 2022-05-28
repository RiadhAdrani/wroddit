import PostCardLoading from "./PostCardLoading";
import PostCardView from "./PostCardView";
import PostController from "../../Models/PostController";

export default ({ post, showBottomBar = true, fullText = false }) => {
    const controller = PostController({
        uid: post.uid,
        userUid: post.user,
        communityUid: post.community,
        showBottomBar,
        showFullText: fullText,
    });

    return controller.isLoading() ? PostCardLoading() : PostCardView(controller);
};
