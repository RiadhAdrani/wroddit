import { Span } from "@riadh-adrani/recursive/components";
import { setState } from "@riadh-adrani/recursive/state";
import CommunityHoverCard from "../Cards/CommunityHoverCard";

export default ({ post, community }) => {
    const [show, setShow] = setState(`show-by-community-${post.user}-${post.uid}`, false);

    return Span({
        text: [community.title, CommunityHoverCard({ community: community, show })],
        style: {
            className: "by-community",
            normal: { position: "relative", zIndex: 1 },
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
