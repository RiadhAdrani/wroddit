import { A } from "@riadh-adrani/recursive/components";
import { setCache } from "@riadh-adrani/recursive";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import {
    authUser,
    doesCommunityExist,
    getCommunityInfo,
    getCommunityPosts,
    getCommunityUsers,
    getPostInfo,
    getSubscriptions,
    getUserInfo,
} from "./Cloud";
import { getRoot } from "@riadh-adrani/recursive/RecursiveRouter/RecursiveRouter";

function since(time) {
    const delta = Date.now() - time;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    const trunc = (n, d) => Math.trunc(n / d);

    if (delta >= year) return `${trunc(delta, year)} ${trunc(delta, year) > 1 ? "years" : "year"}`;

    if (delta >= month)
        return `${trunc(delta, month)} ${trunc(delta, month) > 1 ? "months" : "month"}`;

    if (delta >= week) return `${trunc(delta, week)} ${trunc(delta, week) > 1 ? "weeks" : "week"}`;

    if (delta >= day) return `${trunc(delta, day)} ${trunc(delta, day) > 1 ? "days" : "day"}`;

    if (delta >= hour) return `${trunc(delta, hour)} ${trunc(delta, hour) > 1 ? "hours" : "hour"}`;

    if (delta >= minute)
        return `${trunc(delta, minute)} ${trunc(delta, minute) > 1 ? "minutes" : "minute"}`;

    return `${trunc(delta, second)} ${trunc(delta, second) > 1 ? "seconds" : "second"}`;
}

function hasJoined(user, list) {
    if (!user || !list) return false;

    return list.find((u) => u.email == user);
}

function goToCommunity(name) {
    goTo(`/w=:${name};`);
}

function checkUser(action = () => {}) {
    const [user] = getState("user");
    const [, setRedirect] = getState("redirect");

    if (!user) {
        setRedirect(location.pathname.replace(getRoot() + "/", ""));
        goTo("/login");
        return;
    }

    action();
}

function goToPost(community, post) {
    goTo(`/w=:${community};/post=:${post};`);
}

/**
 *
 * @param {String} text
 */
function urlify(
    text,
    replaceWith = (link) =>
        A({
            href: link,
            children: link,
            target: "blank",
            events: {
                onClick: (e) => {
                    e.stopPropagation();
                },
            },
        })
) {
    const reg = /(https?:\/\/[^\s]+)/g;

    const array = text.replace(/\n/g, " \n").split(" ");
    const map = array.map((item) => {
        return reg.test(item) ? replaceWith(item) : item + " ";
    });

    return map;
}

function isSystemOnDarkTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * @param {String} username username to check
 * @returns {String} error text
 */
function checkUsername(username) {
    if (username.length < 3) {
        return "Username is too short";
    }

    if (/:|;| /gm.test(username)) {
        return `Username cannot contain the characters ":" ";" and white spaces !`;
    }

    return "";
}

/**
 * @param {String} password password to check
 * @param {String} repeatedPassword repeated password
 * @returns {String} error text
 */
function checkPassword(password, repeatedPassword) {
    if (password.length < 3) {
        return "Password is too short";
    }

    if (password != repeatedPassword) {
        return "Passwords does not match !";
    }

    return "";
}

/**
 * @param {String} email email
 * @returns {String} error code
 */
function checkEmail(email) {
    const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!reg.test(email)) {
        return "Email is not formatted properly !";
    }

    return "";
}

function browseFile(onRetrieved = () => {}) {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/png, image/jpeg";

    inp.onchange = () => {
        onRetrieved({
            file: inp.files[0],
            src: URL.createObjectURL(inp.files[0]),
        });
    };

    inp.click();
}

function saveAuth(password) {
    const [user] = getState("user");

    if (user) {
        localStorage.setItem("auth", window.btoa(user.email));
        localStorage.setItem("authCheck", window.btoa(password));
    }
}

function removeAuth() {
    localStorage.removeItem("auth");
    localStorage.removeItem("authCheck");
}

function getAuth() {
    const value = localStorage.getItem("auth");
    const authCheck = localStorage.getItem("authCheck");
    return value ? { auth: window.atob(value), check: window.atob(authCheck) } : null;
}

async function autoLogin() {
    const stored = getAuth();

    if (!stored) return;

    const [, setUser] = getState("user");
    const [, setSub] = getState("subscription");
    const [, setAutoLogging] = getState("auto-logging");

    const res = await authUser(stored.auth, stored.check);
    const data = await getUserInfo(res.user.email);

    updateAfter(() => {
        setUser({ ...data.data(), email: data.id });
        setAutoLogging(false);
    });

    const sub = await getSubscriptions(res.user.email);

    updateAfter(() => {
        setSub({ loading: false, posts: sub });
    });

    return;
}

export {
    autoLogin,
    saveAuth,
    removeAuth,
    getAuth,
    browseFile,
    checkUsername,
    checkPassword,
    checkEmail,
    since,
    hasJoined,
    goToCommunity,
    checkUser,
    goToPost,
    urlify,
    isSystemOnDarkTheme,
};
