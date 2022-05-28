import { getState, setState, setTitle, updateAfter } from "@riadh-adrani/recursive";
import { joinCommunity, leaveCommunity } from "./Cloud";
import { checkUser } from "./Utility";
import { communityDataState, communityState } from "../StateManagement/StateManager";

export default (communityUid) => {
    const [user] = getState("user");
    const [community] = communityState(communityUid);
    const [data, setData] = communityDataState(communityUid);
    const [sort, setSort] = setState(`sort-community-posts-${communityUid}`, "new");
    const [count, setCount] = setState(`count-community-posts-${communityUid}`, 10);
    const [loading, setLoading] = setState(`join-community-loading-${communityUid}`, false);

    function isLoading() {
        return !(data && community);
    }

    function hasUserJoinedCommunity() {
        if (!user) return false;
        return data.users.find((_user) => _user.email === user.email) != null;
    }

    function sortPosts(sortType) {
        setSort(sortType);
    }

    function performSort() {
        switch (sort) {
            case "new":
                return data.posts.sort((a, b) => b.created - a.created);
            case "old":
                return data.posts.sort((a, b) => a.created - b.created);
            case "hot":
                return data.posts.sort((a, b) => b.recentInteraction - a.recentInteraction);
            default:
                return data.posts;
        }
    }

    function postsToDisplay() {
        return performSort().slice(0, count);
    }

    function loadMorePosts() {
        if (data.posts.length > count) {
            setCount(count + 10);
        }
    }

    function onJoinButtonClicked() {
        checkUser(async () => {
            setLoading(true);

            if (hasUserJoinedCommunity()) {
                leaveCommunity(user.email, community.name).then((res) => {
                    updateAfter(() => {
                        if (res) {
                            data.users = data.users.filter((u) => u.email != user.email);
                        }
                        setData(data);
                        setLoading(false);
                    });
                });
            } else {
                joinCommunity(user.email, community.name).then((res) => {
                    updateAfter(() => {
                        setLoading(false);
                        if (res) {
                            data.users = [
                                ...data.users,
                                { joined: new Date().getTime(), email: user.email },
                            ];
                        }
                        setData(data);
                    });
                });
            }
        });
    }

    function addPost(post) {
        data.posts = [post, ...data.posts];
        setData(data);
    }

    setTitle(community && community.title ? `${community.title} | Wroddit` : "Community | Wroddit");

    return {
        sort,
        data,
        community,
        loading,
        addPost,
        postsToDisplay,
        loadMorePosts,
        isLoading,
        performSort,
        sortPosts,
        hasUserJoinedCommunity,
        onJoinButtonClicked,
    };
};
