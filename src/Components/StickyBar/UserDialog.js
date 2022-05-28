import { Column, EmptyBox, H3, P, Row } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import { getAssetLink, logOut, updateUserInfo, uploadImage } from "../../Models/Cloud";
import { getTheme } from "../../Models/Theme";
import { removeAuth, since } from "../../Models/Utility";
import EditableBanner from "../CreateCommunity.js/EditableBanner";
import EditablePicture from "../CreateCommunity.js/EditablePicture";
import StandardButtonIcon from "../Standard/StandardButtonIcon";

export default (props) => {
    const [user, setUser] = getState("user");
    const show = props.show && user != null;
    const theme = getTheme();

    const [banner, setBanner] = setState("edit-user-banner", { src: user.banner });
    const [pic, setPic] = setState("edit-user-pic", { src: user.picture });
    const [loading, setLoading] = setState("edit-user-loading", false);
    const [progress, setProgress] = setState("edit-user-progress", "");

    const showButtons = banner.src != user.banner || pic.src != user.picture;

    function uploadAssets() {
        if (!banner.file && !pic.file) return;

        setLoading(true);
        setProgress("");

        if (banner.file && !pic.file) {
            uploadBanner(async () => {
                setProgress("Updating profile ...");

                const link = await getAssetLink(`banner-${user.email}`);
                await updateUserInfo(user.email, { banner: link });

                updateAfter(() => {
                    user.banner = link;

                    setBanner({ src: link });
                    setLoading(false);
                    setProgress("");
                    setUser(user);
                });
            });
        } else if (!banner.file && pic.file) {
            uploadPicture(async () => {
                setProgress("Updating profile ...");

                const link = await getAssetLink(`picture-${user.email}`);
                await updateUserInfo(user.email, { picture: link });

                updateAfter(() => {
                    user.picture = link;

                    setPic({ src: link });
                    setLoading(false);
                    setProgress("");
                    setUser(user);
                });
            });
        } else {
            uploadBanner(() => {
                uploadPicture(async () => {
                    setProgress("Updating profile ...");

                    const bLink = await getAssetLink(`banner-${user.email}`);
                    const pLink = await getAssetLink(`picture-${user.email}`);

                    await updateUserInfo(user.email, { banner: bLink, picture: pLink });

                    updateAfter(() => {
                        user.banner = bLink;
                        user.picture = pLink;

                        setPic({ src: pLink });
                        setBanner({ src: bLink });
                        setLoading(false);
                        setProgress("");
                        setUser(user);
                    });
                });
            });
        }
    }

    function uploadBanner(onCompleted) {
        if (banner.file) {
            uploadImage(
                `banner-${user.email}`,
                banner.file,
                (progress) => {
                    setProgress(`Uploading banner : ${progress}%`);
                },
                () => {
                    if (onCompleted) onCompleted();
                }
            );
        }
    }

    function uploadPicture(onCompleted) {
        if (pic.file) {
            uploadImage(
                `picture-${user.email}`,
                pic.file,
                (progress) => {
                    setProgress(`Uploading picture : ${progress}%`);
                },
                () => {
                    if (onCompleted) onCompleted();
                }
            );
        }
    }

    return Column({
        flags: { renderIf: show },
        style: {
            inline: {
                position: "absolute",
                right: 0,
                width: "300px",
                top: "50px",
                border: `1px solid ${theme.tertiary}`,
                background: theme.secondary,
                borderRadius: "2.5px",
                animation: "slideDownFading 0.2s 1",
                boxShadow: `0px 0px 2px 0px ${theme.accent}`,
            },
        },
        children: [
            EditableBanner({
                state: "edit-user-banner",
                height: "100px",
                text: "Edit profile banner",
                editable: loading != true,
            }),
            EditablePicture({
                state: "edit-user-pic",
                size: 75,
                style: { alignSelf: "center", marginTop: "-30px" },
                editable: loading != true,
            }),
            Column({
                style: {
                    inline: { padding: "5px 10px", alignItems: "center" },
                },
                children: [
                    H3({ text: `u/${user.username}`, style: { inline: { fontSize: "1.1em" } } }),
                    P({
                        text: `Joined Wroddit ${since(user.joined)} ago`,
                        style: { inline: { fontSize: "0.8em" } },
                    }),
                    EmptyBox({ height: "10px" }),
                    Row({
                        style: { inline: { marginBottom: "10px" } },
                        children: [
                            StandardButtonIcon({
                                text: progress ? progress : "Save",
                                render: showButtons,
                                disabled: loading,
                                fa: progress ? "fa-solid fa-loader" : "fa-solid fa-upload",
                                onClick: uploadAssets,
                            }),
                            EmptyBox({ width: "10px" }),
                            StandardButtonIcon({
                                text: "Reset",
                                render: showButtons,
                                disabled: loading,
                                fa: "fa-solid fa-delete-left",
                                onClick: () => {
                                    setBanner({ src: user.banner });
                                    setPic({ src: user.picture });
                                },
                            }),
                        ],
                    }),
                    StandardButtonIcon({
                        text: "Log out",
                        fa: "fa-solid fa-arrow-right-from-bracket",
                        disabled: loading,
                        loading,
                        onClick: () => {
                            setLoading(true);
                            logOut().then(() => {
                                removeAuth();
                                goTo("/login");
                                setUser(null);
                                setLoading(false);
                            });
                        },
                    }),
                    EmptyBox({ height: "10px" }),
                ],
            }),
        ],
    });
};
