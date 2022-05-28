import { getState, setState, updateAfter } from "@riadh-adrani/recursive";
import { Column } from "@riadh-adrani/recursive/components";
import { getPostRef } from "../../Models/Cloud";
import { getTheme } from "../../Models/Theme";

export default (notification, setNotification) => {
    const theme = getTheme();
    const [sub, setSub] = getState("subscription");

    function getNewPosts() {
        if (sub.laoding) return;

        sub.loading = true;
        setSub(sub);

        (async () => {
            const newItems = [];

            for (let post of notification.newItems) {
                const data = await getPostRef(post);

                newItems.push(data);
            }

            updateAfter(() => {
                notification.newItems = [];
                setNotification(notification);
                sub.posts = [...newItems, ...sub.posts];
                setSub(sub);
            });
        })();
    }

    return Column({
        flags: { renderIf: notification.newItems.length > 1 },
        children: sub.loading ? "Working ..." : "You have new posts for your feed !",
        style: {
            className: "new-posts-notification",
            normal: {
                padding: "10px",
                alignItems: "center",
                backgroundColor: theme.accent,
                position: "fixed",
                bottom: "0",
                left: "0",
                right: "0",
                zIndex: 2,
                animation: "slideDownFading ease-in 0.2s 1",
                cursor: "pointer",
                borderRadius: "2.5px",
            },
            hover: {
                backgroundColor: theme.accentSecondary,
            },
            active: {
                backgroundColor: theme.accentTertiary,
            },
        },
        events: {
            onClick: getNewPosts,
        },
    });
};
