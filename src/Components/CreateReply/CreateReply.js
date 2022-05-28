import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import { checkUser } from "../../Models/Utility";
import { addReply } from "../../Models/Cloud";
import CreateReplyView from "./CreateReplyView";

export default (path, subPath, replyType, parent, onReply = () => {}) => {
    const [reply, setReply] = setState(`${path}-my-reply`, "");
    const [busy, setBusy] = setState(`${path}-my-reply-busy`, false);
    const [user] = getState("user");

    return CreateReplyView(reply, "Reply", busy, {
        onInput: (e) => {
            setReply(e.target.value.slice(0, 1000));
        },
        reply: () => {
            checkUser(async () => {
                if (!reply.trim()) return;

                setBusy(true);

                const output = await addReply(path, subPath, replyType, parent, reply, user.email);

                updateAfter(() => {
                    setReply("");
                    setBusy(false);
                    onReply(output);
                });
            });
        },
    });
};
