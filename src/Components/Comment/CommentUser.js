import { Span } from "@riadh-adrani/recursive/components";
import { setState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import UserHoverCard from "../Cards/UserHoverCard";

export default ({ comment, user }) => {
    const [show, setShow] = setState(`comment-show-user-by-${user.email}-${comment.uid}`, false);
    const theme = getTheme();

    return Span({
        text: [user.username, UserHoverCard({ show, user, zIndex: 2 })],
        style: {
            className: "comment-username",
            normal: {
                position: "relative",
                cursor: "pointer",
                fontWeight: "normal",
                color: theme.accentTertiary,
            },
            hover: { textDecoration: "underline" },
        },
        events: {
            onMouseEnter: () => {
                setShow(true);
            },
            onMouseLeave: () => {
                setShow(false);
            },
        },
    });
};
