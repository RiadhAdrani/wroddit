import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import {
    getCommentData,
    removeUpVoteComment,
    upVoteComment,
    downVoteComment,
    removeDownVoteComment,
} from "../../Models/Cloud";
import { setUserState } from "../../Models/Utility";
import { userState } from "../../StateManagement/StateManager";
import ReplyLoadingView from "./ReplyLoadingView";
import ReplyView from "./ReplyView";

export default (info, path, level) => {
    const [current] = getState(`user`);
    const [user] = userState(info.user);
    const [showReplies, setShowReplies] = setState(`${path}/replies/${info.uid}/show`, false);
    const [edit, setEdit] = setState(`${path}/edit`, false);
    const [reply, setReply] = setState(path, { ...info, loading: true, busy: false }, async () => {
        const res = await getCommentData(path, info.uid);

        updateAfter(() => {
            const d = { ...info, ...res, loading: false, busy: false };
            setReply(d);
        });
    });

    async function upVote() {
        const is = reply.up.find((item) => item.user == current.email);

        reply.busy = true;
        setReply(reply);

        if (is) {
            await removeUpVoteComment(current.email, path);
            reply.up.filter((item) => {
                item.user != current.email;
            });
        } else {
            await upVoteComment(current.email, path);
            reply.down = reply.down.filter((item) => item.user != current.email);
            reply.up = [...reply.up, { date: Date.now(), user: current.email }];
        }

        setReply({ ...reply, busy: false });
    }

    async function downVote() {
        const is = reply.down.find((item) => item.user == current.email);

        reply.busy = true;
        setReply(reply);

        if (is) {
            await removeDownVoteComment(current.email, path);
            reply.down.filter((item) => {
                item.user != current.email;
            });
        } else {
            await downVoteComment(current.email, path);
            reply.up = reply.up.filter((item) => item.user != current.email);
            reply.down = [...reply.down, { date: Date.now(), user: current.email }];
        }

        setReply({ ...reply, busy: false });
    }

    return reply.loading
        ? ReplyLoadingView()
        : ReplyView(reply, user, showReplies, edit, level, {
              upVote,
              downVote,
              edit: () => setEdit(!edit),
              toggleShow: () => setShowReplies(!showReplies),
              reply: (newReply) => {
                  reply.replies = [...reply.replies, newReply];
                  setEdit(false);
                  setShowReplies(true);
                  setReply(reply);
              },
          });
};
