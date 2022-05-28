import {
    BorderSpinner,
    Column,
    EmptyBox,
    H4,
    LazyColumn,
} from "@riadh-adrani/recursive/components";
import { getState, setState } from "@riadh-adrani/recursive/state";
import NewItemsInFeed from "../Components/Home/NewItemsInFeed";
import NotLoggedIn from "../Components/Home/NotLoggedIn";
import PostCard from "../Components/Post/PostCard";
import { getTheme } from "../Models/Theme";
import { newPostsNotificationState } from "../StateManagement/StateManager";
import { mediaQueries } from "../Style";

export default () => {
    const [subscription] = getState("subscription");
    const theme = getTheme();
    const [count, setCount] = setState("feed-count", 10);
    const [user] = getState("user");
    const [liveNotification, setLiveNotification] = newPostsNotificationState();

    return LazyColumn({
        onObserved: () => {
            if (count < subscription.posts.length) {
                setCount(count + 10);
            }
        },
        style: {
            className: "home-page",
            normal: {
                marginTop: "20px",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "800px",
                minWidth: "800px",
            },
            mediaQueries: mediaQueries({
                small: {
                    normal: {
                        maxWidth: "auto",
                        minWidth: "auto",
                        marginLeft: "10px",
                        marginRight: "10px",
                    },
                },
            }),
        },
        children: [
            NewItemsInFeed(liveNotification, setLiveNotification),
            NotLoggedIn(),
            Column({
                flags: { renderIf: subscription.loading == true },
                style: {
                    inline: {
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                        animation: "slideDownFading 0.4s 1",
                    },
                },
                children: [
                    BorderSpinner({ color: theme.accent }),
                    H4({ text: "Loading new Posts ..." }),
                ],
            }),
            ...subscription.posts
                .sort((a, b) => b.created - a.created)
                .slice(0, count)
                .map((post) => PostCard({ post, fullText: false, showBottomBar: true })),
            EmptyBox({ height: "10px" }),
        ],
    });
};
