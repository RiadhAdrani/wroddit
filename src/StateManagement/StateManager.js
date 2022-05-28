import { async } from "@firebase/util";
import { getState, setCache, setState, updateAfter } from "@riadh-adrani/recursive";
import {
    getCommunityInfo,
    getCommunityPosts,
    getCommunityUsers,
    getPostData,
    getPostInfo,
    getRandomPosts,
    getUserInfo,
    watchCommunityPosts,
    watchUserSubscription,
} from "../Models/Cloud";
import { Themes } from "../Models/Theme";
import { isSystemOnDarkTheme } from "../Models/Utility";

function userState(user) {
    const [value, setValue] = setCache(`u/${user}`, null, async () => {
        const ref = await getUserInfo(user);

        updateAfter(() => {
            setValue(ref.exists ? { ...ref.data(), email: ref.id } : { notFound: true });
        });
    });

    return [value, setValue];
}

function communityState(community) {
    const [value, setValue] = setCache(`community-${community}`, null, async () => {
        const ref = await getCommunityInfo(community);

        updateAfter(() => {
            setValue(
                ref.exists && ref.data() ? { ...ref.data(), uid: ref.id } : { notFound: true }
            );
        });
    });

    return [value, setValue];
}

function communityDataState(community) {
    const [value, setValue] = setState(`community-data-${community}`, null, async () => {
        const users = await getCommunityUsers(community);
        const posts = await getCommunityPosts(community);

        updateAfter(() => {
            setValue({ users, posts });
        });
    });

    return [value, setValue];
}

function postState(post, community, user) {
    const [value, setValue] = setCache(`post-${post}`, null, async () => {
        const ref = await getPostInfo(post);

        updateAfter(() => {
            setValue(ref.exists ? { ...ref.data(), uid: ref.id } : { notFound: true });
        });
    });

    const [originalCreator] = userState(user);
    const [originalCommunity] = communityState(community);

    return [value, setValue, originalCreator, originalCommunity];
}

function postInteractionsState(post) {
    const [value, setValue] = setState(`post-interactions-${post}`, null, async () => {
        const data = await getPostData(post);

        updateAfter(() => {
            setValue(data);
        });
    });

    return [value, setValue];
}

function subscriptionState() {
    const [value, setValue] = setState("subscription", { loading: true, posts: [] }, async () => {
        const res = await getRandomPosts();

        updateAfter(() => {
            setValue({ loading: false, posts: res });
        });
    });

    return [value, setValue];
}

function themeState() {
    const [value, setValue] = setState("theme", isSystemOnDarkTheme() ? Themes.Dark : Themes.Light);

    return [value, setValue];
}

function newPostsNotificationState() {
    const [user] = getState("user");

    const [value, setValue, , , liveValue] = setState(
        `live-notification-${user ? user.email : ""}`,
        { newItems: [], watched: {}, unsub: () => {} },
        () => {
            if (user == null) return;

            const unsubscribe = watchUserSubscription(
                user.email,
                (items) => {
                    items.forEach((community) => {
                        const unsubFromCommunity = watchCommunityPosts(
                            community.uid,
                            () => {
                                liveValue().watched[community.uid] = {
                                    name: community.uid,
                                    unsub: unsubFromCommunity,
                                };
                                setValue(liveValue());
                            },
                            (post) => {
                                if (liveValue().newItems.includes(post)) return;

                                liveValue().newItems.push(post);

                                setValue(liveValue());
                            }
                        );
                    });

                    liveValue().unsub = unsubscribe;
                    setValue(liveValue());
                },
                (community) => {
                    const unsubFromCommunity = watchCommunityPosts(
                        community,
                        () => {
                            liveValue().watched[community] = {
                                name: community,
                                unsub: unsubFromCommunity,
                            };
                            setValue(liveValue());
                        },
                        (post) => {
                            if (liveValue().newItems.includes(post)) return;

                            liveValue().newItems.push(post);
                            setValue(liveValue());
                        }
                    );
                },
                (item) => {
                    liveValue().watched[item]?.unsub();
                }
            );
        },
        () => {
            if (liveValue().watched)
                for (let sub in liveValue().watched) {
                    liveValue().watched[sub].unsub();
                }

            liveValue().unsub();
        }
    );

    return [value, setValue];
}

export {
    userState,
    postState,
    postInteractionsState,
    communityState,
    communityDataState,
    subscriptionState,
    themeState,
    newPostsNotificationState,
};
