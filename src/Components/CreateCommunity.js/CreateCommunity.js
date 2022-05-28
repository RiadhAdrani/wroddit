import { Column, EmptyBox, H3, P, Row } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import {
    createCommunity,
    getAssetLink,
    updateCommunityInfo,
    uploadImage,
} from "../../Models/Cloud";
import { checkUser, goToCommunity } from "../../Models/Utility";
import StandardArrayInput from "../Standard/StandardArrayInput";
import StandardArrayItem from "../Standard/StandardArrayItem";
import StandardButton from "../Standard/StandardButton";
import StandardTextField from "../Standard/StandardTextField";
import StandardTextArea from "../Standard/StandardTextArea";
import EditablePicture from "./EditablePicture";
import EditableBanner from "./EditableBanner";
import { getTheme } from "../../Models/Theme";
import StandardButtonIcon from "../Standard/StandardButtonIcon";
import { mediaQueries } from "../../Style";

export default () => {
    const [name, setName] = setState("new-community-name", "");
    const [title, setTitle] = setState("new-community-title", "");
    const [tags, setTags] = setState("new-community-tags", []);
    const [description, setDescription] = setState("new-community-description", "");
    const [newTag, setNewTag] = setState("new-community-new-tag", "");
    const [picture, setPicture] = setState("new-community-picture", {});
    const [bg, setBg] = setState("new-community-bg", {});

    const [loading, setLoading] = setState("new-community-loading", false);
    const [error, setError] = setState("new-community-error", "");
    const [info, setInfo] = setState("new-community-info", "");
    const [user] = getState("user");
    const [show, setShow] = setState("new-community-show", false);

    const theme = getTheme();

    function hideShow() {
        updateAfter(() => {
            setName("");
            setTitle("");
            setDescription("");
            setTags([]);
            setLoading(false);
            setError("");
            setBg({});
            setPicture({});
            setInfo("");
            setShow(false);
        });
    }

    async function tryCreateCommunity() {
        if (!user) {
            updateAfter(() => {
                setShow(false);
                goTo("/login");
            });

            return;
        }

        const cn = name.trim().toLowerCase();
        const ct = title.trim();

        if (cn.length < 3 || cn.includes(" ")) {
            setError("Name is too short or contains white spaces !");
            return;
        }

        if (ct.length < 3) {
            setError("Title is too short !");
            return;
        }

        updateAfter(() => {
            setLoading(true);
            setError("");
        });

        const res = await createCommunity(
            cn,
            ct,
            user.email,
            description.trim(),
            tags,
            picture,
            bg
        );

        if (res === false) {
            updateAfter(() => {
                setError("Community already exist !");
                hideShow();
            });
            return;
        }

        uploadImage(
            `${cn}-picture`,
            picture.file,
            (progress) => {
                setInfo(`uploading profile picture : ${progress}%`);
            },
            () => {
                uploadImage(
                    `${cn}-banner`,
                    bg.file,
                    (progress) => {
                        setInfo(`uploading banner : ${progress}%`);
                    },
                    async () => {
                        const picURL = await getAssetLink(`${cn}-picture`);
                        const bgURL = await getAssetLink(`${cn}-banner`);

                        console.log({ picURL, bgURL });

                        await updateCommunityInfo(cn, { banner: bgURL, picture: picURL });

                        hideShow();
                        goToCommunity(cn);
                    }
                );
            },
            () => {}
        );
    }

    return Column({
        events: {
            onClickGlobal: () => {
                setShow(false);
            },
        },
        children: [
            StandardButtonIcon({
                text: "Create Community",
                fa: "fa-solid fa-plus",
                loading,
                disabled: loading,
                onClick: () =>
                    checkUser(() => {
                        setShow(!show);
                    }),
            }),
            Column({
                flags: { renderIf: show },
                style: {
                    className: "new-community-input-box",
                    normal: {
                        position: "fixed",
                        top: "60px",
                        right: "10px",
                        minWidth: "500px",
                        maxWidth: "500px",
                        padding: "10px",
                        background: theme.secondary,
                        border: `1px solid ${theme.accent}`,
                        borderRadius: "2.5px",
                        animation: "slideDownFading 0.25s 1",
                    },
                    mediaQueries: mediaQueries({
                        smaller: { normal: { maxWidth: "350px", minWidth: "350px" } },
                    }),
                },
                children: [
                    H3({
                        text: "Create community :",
                        style: {
                            className: "new-community-dialog-title",
                            normal: { fontSize: "1.1em" },
                        },
                    }),
                    EditableBanner({
                        state: "new-community-bg",
                        text: "Edit banner (pref. height: 144px)",
                    }),
                    EditablePicture({
                        state: "new-community-picture",
                        style: { alignSelf: "center", marginTop: "-40px" },
                    }),
                    EmptyBox({ height: "5px" }),
                    StandardTextField({
                        state: "new-community-name",
                        placeholder: "New community name",
                        disabled: loading,
                    }),
                    EmptyBox({ height: "5px" }),
                    StandardTextField({
                        state: "new-community-title",
                        placeholder: "New community title",
                        disabled: loading,
                    }),
                    EmptyBox({ height: "5px" }),
                    StandardTextArea({
                        state: "new-community-description",
                        busy: loading,
                        placeholder: "New Community description",
                    }),
                    EmptyBox({ height: "5px" }),
                    Row({
                        style: {
                            className: "edit-tags-wrapper",
                            normal: {
                                flexWrap: "wrap",
                                border: `1px solid ${theme.accent}`,
                                borderRadius: "2.5px",
                                padding: "5px 20px",
                            },
                        },
                        children: [
                            Row({
                                style: {
                                    className: "edit-tags",
                                    normal: {
                                        flexWrap: "wrap",
                                    },
                                },
                                children: tags.map((tag) =>
                                    StandardArrayItem({
                                        text: tag,
                                        onClick: () => {
                                            setTags(tags.filter((t) => t != tag));
                                        },
                                    })
                                ),
                            }),
                            StandardArrayInput({
                                state: "new-community-new-tag",
                                placeholder: "new tag",
                                onEnter: (e) => {
                                    if (newTag.trim()) {
                                        setTags([...tags, newTag.trim()]);
                                        setNewTag("");
                                        e.target.focus();
                                    }
                                },
                            }),
                        ],
                    }),
                    EmptyBox({ height: "5px" }),
                    P({
                        flags: { renderIf: info != "" },
                        text: info,
                        style: {
                            inline: {
                                color: theme.accentTertiary,
                                fontSize: "0.85em",
                                padding: "5px 20px",
                                border: `1px solid ${theme.accent}`,
                                borderRadius: "2.5px",
                            },
                        },
                    }),
                    P({
                        flags: { renderIf: error != "" },
                        text: error,
                        style: {
                            inline: { color: "red", fontSize: "0.85em" },
                        },
                    }),
                    EmptyBox({ height: "10px" }),
                    StandardButton({
                        text: "Create",
                        onClick: () => tryCreateCommunity(),
                        disabled: loading,
                        loading,
                    }),
                ],
            }),
        ],
    });
};
