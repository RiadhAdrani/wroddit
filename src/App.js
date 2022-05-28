import { Column, Fragment } from "@riadh-adrani/recursive/components";
import { renderRoute, getParams } from "@riadh-adrani/recursive/router";
import { setState } from "@riadh-adrani/recursive/state";
import Router from "./Router";
import { globalStyle } from "./Style";
import StickyBar from "./Components/StickyBar/StickyBar";
import {
    newPostsNotificationState,
    subscriptionState,
    themeState,
} from "./StateManagement/StateManager";
import { setStyle } from "@riadh-adrani/recursive";
import { autoLogin, getAuth } from "./Models/Utility";
import AutoLogging from "./Components/Home/AutoLogging";
import GithubLink from "./Components/Home/GithubLink";

globalStyle();
Router();

export default () => {
    setState("user", null);
    setState("redirect", "");
    subscriptionState();
    newPostsNotificationState();

    const [autoLogging] = setState("auto-logging", getAuth() != null ? true : false, async () => {
        const stored = getAuth();

        if (!stored) return;

        await autoLogin();
    });

    const [theme] = themeState();

    setStyle({
        selectors: {
            // body: { overflowY: getParams().post ? "hidden" : "scroll" },
            "::-webkit-scrollbar": {
                width: "8px",
            },
            "::-webkit-scrollbar-track": {
                background: theme.secondary,
            },
            "::-webkit-scrollbar-thumb": {
                background: theme.accentSecondary,
                borderRadius: "2.5px",
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: theme.accentTertiary,
            },
        },
    });

    return Column({
        style: {
            inline: {
                flex: 1,
                backgroundColor: theme.primary,
                color: theme.text,
            },
        },
        children: [
            AutoLogging(autoLogging),
            GithubLink(),
            Fragment({
                flags: { renderIf: !autoLogging },
                components: [StickyBar(), renderRoute()],
            }),
        ],
    });
};
