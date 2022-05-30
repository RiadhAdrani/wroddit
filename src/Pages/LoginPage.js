import { Column, EmptyBox, H2, Input, P, Row } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import { authUser, getSubscriptions, getUserInfo } from "../Models/Cloud";
import { getTheme } from "../Models/Theme";
import InputField from "../Components/Login/InputField";
import StandardButton from "../Components/Standard/StandardButton";
import StandardTextLink from "../Components/Standard/StandardTextLink";
import AlreadyLoggedIn from "../Components/Login/AlreadyLoggedIn";
import { saveAuth } from "../Models/Utility";

export default () => {
    const [email] = setState("login-email", "");
    const [password] = setState("login-password", "");
    const [busy, setBusy] = setState("login-busy", false);
    const [error, setError] = setState("login-error", "");
    const theme = getTheme();
    const [user] = getState("user");
    const [remember, setRemember] = setState("login-remember", false);

    const tryLogin = async () => {
        const [, setUser] = getState("user");
        const [redirect, setRedirect] = getState("redirect");
        const [, setSub] = getState("subscription");

        updateAfter(() => {
            setBusy(true);
            setError("");
        });

        try {
            const res = await authUser(email, password);
            const data = await getUserInfo(res.user.email);

            updateAfter(() => {
                setUser({ ...data.data(), email: data.id });
                if (remember) {
                    saveAuth(password.trim());
                }
                goTo(redirect ? redirect : "/");
            });

            setSub({ loading: true, posts: [] });

            const sub = await getSubscriptions(res.user.email);

            updateAfter(() => {
                setSub({ loading: false, posts: sub });
                setRedirect("");
            });
        } catch (e) {
            updateAfter(() => {
                setError(e.message ? e.message : "Something went wrong ...");
                setBusy(false);
            });
        }
    };

    return Column({
        style: {
            className: "login-page",
            normal: {
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            },
        },
        children: [
            AlreadyLoggedIn(),
            Column({
                flags: { renderIf: user == null },
                style: {
                    className: "login-dialog",
                    normal: {
                        padding: "30px 20px",
                        width: "400px",
                        border: `1px solid ${theme.accent}`,
                        borderRadius: "2.5px",
                        background: theme.secondary,
                    },
                },
                children: [
                    H2({ text: "Login to Wroddit" }),
                    P({
                        text: "Join millions of (imaginary) people and discuss an infinity of topics in user-managed communities.",
                        style: { inline: { fontSize: "0.9em" } },
                    }),
                    EmptyBox({ height: "20px" }),
                    InputField({ state: "login-email", placeholder: "Email", disabled: busy }),
                    EmptyBox({ height: "10px" }),
                    InputField({
                        state: "login-password",
                        placeholder: "Password",
                        type: "password",
                        disabled: busy,
                    }),
                    EmptyBox({ height: "10px" }),
                    Row({
                        style: {
                            className: "remember-me-box",
                            scoped: true,
                            normal: {
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                padding: "5px",
                            },
                            hover: {
                                backgroundColor: theme.secondary,
                            },
                        },
                        events: {
                            onClick: () => {
                                if (!busy) setRemember(!remember);
                            },
                        },
                        children: [
                            P({ text: "Remember me" }),
                            EmptyBox({ width: "5px" }),
                            Input({
                                type: "checkbox",
                                disabled: busy,
                                checked: remember,
                                style: { inline: { accentColor: theme.accentTertiary } },
                            }),
                        ],
                    }),
                    EmptyBox({ height: "10px" }),
                    StandardButton({
                        text: "Connect",
                        loading: busy,
                        onClick: () => {
                            tryLogin();
                        },
                        disabled: busy,
                    }),
                    P({
                        text: error,
                        flags: { renderIf: error.trim() != "" },
                        style: {
                            className: "login-error",
                            normal: { color: "red", marginTop: "10px", textAlign: "center" },
                        },
                    }),
                    EmptyBox({ height: "20px" }),
                    StandardTextLink({ text: "No Account ? Create one here !", to: "/register" }),
                ],
            }),
        ],
    });
};
