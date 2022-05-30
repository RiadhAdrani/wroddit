import { Column, Div, EmptyBox, H1, Img, Link, Row } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import SearchBar from "../SearchBar/SearchBar";
import ThemeSwitch from "./ThemeSwitch";
import CreateCommunity from "../CreateCommunity.js/CreateCommunity";
import UserButton from "./UserButton";
import { getRoute, getState, goTo, setState, updateAfter } from "@riadh-adrani/recursive";
import { getSubscriptions } from "../../Models/Cloud";
import logo from "../../media/wroddit.png";
import logoDark from "../../media/wroddit-dark.png";
import { mediaQueries } from "../../Style";
import StandardButtonIcon from "../Standard/StandardButtonIcon";

export default () => {
    const theme = getTheme();
    const [user] = getState("user");
    const [notification, setNotification] = getState(`live-notification-${user ? user.email : ""}`);
    const [sub, setSub] = getState(`subscription`);

    const [showSearch, setShowSearch] = setState("show-search-only", false);

    async function updateFeed() {
        const res = await getSubscriptions(user.email);

        updateAfter(() => {
            setNotification({ ...notification, newItems: [] });
            setSub({ loading: false, posts: res });
        });
    }

    return Row({
        style: {
            className: "top-bar",
            normal: {
                height: "50px",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 10px",
                borderBottom: `1px solid ${theme.secondary}`,
                position: "sticky",
                top: "0px",
                boxShadow: `0px 0px 5px 0px ${theme.accent}`,
                background: theme.secondary,
                zIndex: 2,
            },
        },
        children: [
            Link({
                to: "/",
                events: {
                    onClick: () => {
                        window.scrollTo({ top: 0, behavior: "smooth" });

                        if (getRoute() != "/") {
                            goTo("/");
                            return;
                        }

                        if (!user || sub.loading) return;

                        setSub({ loading: true, posts: sub.posts });

                        updateFeed();
                    },
                },
                style: {
                    className: "wroddit-title",
                    normal: {
                        textDecoration: "none",
                        color: theme.text,
                        padding: "0px 10px",
                        borderRadius: "2.5px",
                        fontSize: "0.8em",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    },
                    hover: { background: theme.secondary },
                },
                children: [
                    Img({
                        src: theme.name == "light" ? logo : logoDark,
                        height: 35,
                        alt: "Wroddit",
                    }),
                    H1({
                        text: "Wroddit",
                        style: {
                            inline: { marginLeft: "10px", fontSize: "1.75em" },
                            className: "sticky-title-text",
                            mediaQueries: mediaQueries({ small: { normal: { display: "none" } } }),
                        },
                    }),
                ],
            }),
            Row({
                style: {
                    className: "search-wrapper",
                    mediaQueries: mediaQueries({ small: { normal: { marginLeft: "auto" } } }),
                },
                children: [
                    Row({
                        children: StandardButtonIcon({
                            text: "Search",
                            fa: showSearch ? "fa-solid fa-circle-xmark" : "fa-solid fa-search",
                            onClick: () => {
                                setShowSearch(!showSearch);
                            },
                        }),
                        style: {
                            className: "toggle-search-responsive",
                            normal: { marginRight: "5px", display: "none" },
                            mediaQueries: mediaQueries({ small: { normal: { display: "flex" } } }),
                        },
                    }),
                    SearchBar(),
                ],
            }),
            Row({
                style: {
                    inline: { alignItems: "center" },
                    className: "sticky-right-section",
                    mediaQueries: mediaQueries({
                        small: { normal: { display: !showSearch ? "flex" : "none" } },
                    }),
                },
                children: [
                    ThemeSwitch(),
                    EmptyBox({ width: "10px" }),
                    CreateCommunity(),
                    EmptyBox({ width: "10px" }),
                    UserButton(),
                ],
            }),
        ],
    });
};
