import { getState, setState, updateAfter } from "@riadh-adrani/recursive";
import { A } from "@riadh-adrani/recursive/components";
import { removeDownVote, removeUpVote, upVotePost, downVotePost } from "../Models/Cloud";
import { getTheme } from "../Models/Theme";
import { checkUser, urlify } from "../Models/Utility";
import { postInteractionsState, postState } from "../StateManagement/StateManager";

export default ({ uid, userUid, communityUid, showFullText = false, showBottomBar = true }) => {
    const [post, setPost, user, community] = postState(uid, communityUid, userUid);
    const [interactions, setInteractions] = postInteractionsState(uid);
    const [busy, setBusy] = setState(`post-busy-${uid}`);
    const [currentUser] = getState("user");
    const theme = getTheme();

    const [sort, setSort] = setState(`sort-comments-${uid}`, "new");

    const up = interactions ? interactions.upVotes : null;
    const down = interactions ? interactions.downVotes : null;
    const comments = interactions ? interactions.comments : null;

    function isLoading() {
        return !(up && interactions && user && community);
    }

    function hasUserUpVoted() {
        return currentUser ? up.find((item) => item.email == currentUser.email) : false;
    }
    function hasUserDownVoted() {
        return currentUser ? down.find((item) => item.email == currentUser.email) : false;
    }

    function onUpVoteClicked() {
        checkUser(async () => {
            setBusy(true);

            const isUpVoted = hasUserUpVoted();

            if (isUpVoted) {
                await removeUpVote(currentUser.email, post.uid);
                interactions.upVotes = up.filter((u) => u.email != currentUser.email);
            } else {
                await upVotePost(currentUser.email, post.uid);
                interactions.upVotes = [...up, { email: currentUser.email, date: Date.now() }];
            }

            await removeDownVote(currentUser.email, post.uid);
            interactions.downVotes = down.filter((u) => u.email != currentUser.email);

            updateAfter(() => {
                setBusy(false);
                setInteractions(interactions);
            });
        });
    }

    function onDownVoteClicked() {
        checkUser(async () => {
            setBusy(true);

            const isDownVoted = hasUserDownVoted();

            if (isDownVoted) {
                await removeDownVote(currentUser.email, post.uid);
                interactions.downVotes = up.filter((u) => u.email != currentUser.email);
            } else {
                await downVotePost(currentUser.email, post.uid);
                interactions.downVotes = [...down, { email: currentUser.email, date: Date.now() }];
            }

            await removeUpVote(currentUser.email, post.uid);
            interactions.upVotes = up.filter((u) => u.email != currentUser.email);

            updateAfter(() => {
                setBusy(false);
                setInteractions(interactions);
            });
        });
    }

    function text() {
        if (post.text) {
            return urlify(!showFullText ? post.text : post.text.slice(0, 300) + "...", (link) => {
                A({
                    href: link,
                    children: link.slice(0, 50),
                    target: "blank",
                    style: { inline: { color: theme.accentTertiary } },
                });
            });
        } else return "";
    }

    function addComment(comment) {
        interactions.comments = [comment, ...interactions.comments];
        setInteractions(interactions);
    }

    function sortComments(sortType) {
        setSort(sortType);
    }

    return {
        post,
        showBottomBar,
        busy,
        comments,
        user,
        community,
        up,
        down,
        sort,
        text,
        onDownVoteClicked,
        onUpVoteClicked,
        hasUserDownVoted,
        hasUserUpVoted,
        isLoading,
        addComment,
        sortComments,
    };
};
