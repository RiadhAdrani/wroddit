import { Span } from "@riadh-adrani/recursive/components";
import { setState } from "@riadh-adrani/recursive/state";
import UserHoverCard from "../Cards/UserHoverCard";

export default ({ post, user }) => {
    const [show, setShow] = setState(`show-by-user-${user.email}-${post.uid}`, false);

    return Span({
        text: [user.username, UserHoverCard({ user: user, show })],
        style: {
            className: "by-user",
            normal: { position: "relative" },
            hover: {
                textDecoration: "underline",
            },
        },
        events: {
            onClick: (e) => e.stopPropagation(),
            onMouseEnter: () => {
                setShow(true);
            },
            onMouseLeave: () => {
                setShow(false);
            },
        },
    });
};
