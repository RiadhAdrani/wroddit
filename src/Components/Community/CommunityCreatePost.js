import { Column, H3, EmptyBox, P, Row, Img, Div } from "@riadh-adrani/recursive/components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import { createCommunityPost, getAssetLink, updateMedia, uploadImage } from "../../Models/Cloud";
import { getTheme } from "../../Models/Theme";
import { browseFile, checkUser } from "../../Models/Utility";
import StandardButton from "../Standard/StandardButton";
import StandardButtonIcon from "../Standard/StandardButtonIcon";
import StandardErrorText from "../Standard/StandardErrorText";
import StandardIcon from "../Standard/StandardIcon";
import StandardMaxCharacters from "../Standard/StandardMaxCharacters";
import StandardTextArea from "../Standard/StandardTextArea";
import StandardTextButton from "../Standard/StandardTextButton";
import StandardTextField from "../Standard/StandardTextField";

const MAX_SIZE = 1 * 1024 * 1024;

export default (controller) => {
    const [title, setTitle] = setState("new-post-title", "");
    const [text, setText] = setState("new-post-text", "");
    const [media, setMedia] = setState("new-post-img", {});
    const [error, setError] = setState("new-post-error", "");
    const [busy, setBusy] = setState("new-post-busy", false);
    const theme = getTheme();

    function resetFields() {
        setTitle("");
        setText("");
        setMedia({});
        setError("");
    }

    function onButtonClick() {
        checkUser(() => {
            if (title.length < 3 || title.length > 100) {
                setError(
                    "Title length is invalid ! minimum length is 3 characters, while the maximum is 100."
                );
                return;
            }

            if (text.length < 3 || text.length > 1000) {
                setError(
                    "Text length is invalid ! minimum length is 3 characters, while the maximum is 100."
                );
                return;
            }

            setBusy(true);
            setError("");

            const [user] = getState("user");

            const newPost = {
                created: new Date().getTime(),
                recentInteraction: 0,
                text,
                user: user.email,
                title,
                community: controller.community.name,
            };

            createCommunityPost(newPost)
                .then((res) => {
                    if (media.file) {
                        uploadImage(
                            res.uid,
                            media.file,
                            (progress) => {
                                setError(`Uploading media : ${progress} %`);
                            },
                            async () => {
                                const link = await getAssetLink(res.uid);

                                await updateMedia(res.uid, link);

                                updateAfter(() => {
                                    controller.addPost({ ...res, media: link });
                                    setBusy(false);
                                    resetFields();
                                });
                            }
                        );
                    } else {
                        updateAfter(() => {
                            controller.addPost(res);
                            setBusy(false);
                            resetFields();
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                    setBusy(false);
                    resetFields();
                    setError("Something went wrong ...");
                });
        });
    }

    return Column({
        style: {
            className: "create-post-view",
            normal: {
                padding: "10px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "2.5px",
                marginBottom: "10px",
            },
        },
        children: Column({
            children: [
                H3({
                    text: "Create Post",
                    style: {
                        inline: {
                            fontSize: "1em",
                        },
                    },
                }),
                EmptyBox({ height: "10px" }),
                StandardTextField({
                    state: "new-post-title",
                    placeholder: "Title",
                    disabled: busy,
                    max: 100,
                }),
                StandardMaxCharacters(title.length, 100, { marginLeft: "auto", marginTop: "5px" }),
                EmptyBox({ height: "10px" }),
                StandardTextArea({
                    state: "new-post-text",
                    placeholder: "What's new ?",
                    disabled: busy,
                }),
                EmptyBox({ height: "10px" }),
                Row({
                    style: { inline: { justifyContent: "flex-end", alignItems: "center" } },
                    children: [
                        StandardTextButton({
                            busy: busy,
                            renderIf: media.file != undefined,
                            text: [
                                StandardIcon({
                                    fa: "fa-solid fa-circle-xmark",
                                    style: { normal: { marginRight: "5px" } },
                                }),
                                "Remove media",
                            ],
                            onClick: () => setMedia({}),
                        }),
                        EmptyBox({ width: "10px" }),
                        StandardButtonIcon({
                            text: "Add Image / GIF",
                            fa: "fa-solid fa-photo-film",
                            disabled: busy,
                            onClick: () => {
                                browseFile((data) => {
                                    if (data.file.size > MAX_SIZE) {
                                        setError("File size is too big (1 MB)");
                                    } else {
                                        updateAfter(() => {
                                            setError("");
                                            setMedia(data);
                                        });
                                    }
                                });
                            },
                        }),
                    ],
                }),
                EmptyBox({ height: "20px" }),
                Row({
                    children: [
                        Img({
                            flags: { renderIf: media.src != undefined },
                            src: media.src,
                            style: {
                                inline: {
                                    width: "100%",
                                    height: "auto",
                                    marginBottom: "10px",
                                },
                            },
                        }),
                    ],
                }),

                StandardErrorText(error, { marginBottom: "10px" }),
                StandardButton({
                    text: "Create Post",
                    loading: busy,
                    disabled: busy,
                    onClick: onButtonClick,
                }),
            ],
        }),
    });
};
