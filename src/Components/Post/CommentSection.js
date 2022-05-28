import { Column } from "@riadh-adrani/recursive/components";
import CommentView from "../Comment/CommentView";

export default (controller) => {
    function sortComments(sort = controller.sort) {
        switch (sort) {
            case "new":
                return controller.comments.sort((a, b) => b.created - a.created);
            case "old":
                return controller.comments.sort((a, b) => a.created - b.created);
            default:
                return controller.comments;
        }
    }

    return Column({
        style: {
            className: "comment-section",
            normal: {
                padding: "10px",
                borderRadius: "2.5px",
            },
        },
        children: sortComments().map((comment) => CommentView(controller.post, comment)),
    });
};
