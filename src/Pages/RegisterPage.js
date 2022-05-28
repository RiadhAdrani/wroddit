import { Column, EmptyBox, H2, P } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { setState, updateAfter } from "@riadh-adrani/recursive/state";
import InputField from "../Components/Login/InputField";
import StandardButton from "../Components/Standard/StandardButton";
import StandardErrorText from "../Components/Standard/StandardErrorText";
import StandardTextLink from "../Components/Standard/StandardTextLink";
import { createUser } from "../Models/Cloud";
import { getTheme } from "../Models/Theme";
import { checkEmail, checkPassword, checkUsername } from "../Models/Utility";

export default () => {
    const [email] = setState("register-email", "");
    const [username] = setState("register-username", "");
    const [password] = setState("register-password", "");
    const [repeatedPassword] = setState("register-repeat-password", "");
    const [busy, setBusy] = setState("register-busy", false);
    const [error, setError] = setState("register-error", "");

    const theme = getTheme();

    async function register() {
        const uError = checkUsername(username.trim());
        const pError = checkPassword(password.trim(), repeatedPassword.trim());
        const eError = checkEmail(email.trim());

        if (eError) {
            setError(eError);
            return;
        }

        if (uError) {
            setError(uError);
            return;
        }

        if (pError) {
            setError(pError);
            return;
        }

        try {
            updateAfter(() => {
                setBusy(true);
                setError("");
            });

            await createUser(email.trim(), password.trim(), username.trim());

            goTo("/login");

            setBusy(false);
        } catch (e) {
            updateAfter(() => {
                setBusy(false);
                setError(e.message);
            });
        }
    }

    return Column({
        style: {
            className: "register-page",
            normal: {
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            },
        },
        children: [
            Column({
                style: {
                    className: "register-dialog",
                    normal: {
                        padding: "30px 20px",
                        width: "400px",
                        border: `1px solid ${theme.accent}`,
                        borderRadius: "2.5px",
                    },
                },
                children: [
                    H2({ text: "Join Wroddit" }),
                    P({
                        text: "Join millions of (imaginary) people and discuss an infinity of topics in user-managed communities.",
                        style: { inline: { fontSize: "0.9em" } },
                    }),
                    EmptyBox({ height: "20px" }),
                    InputField({
                        state: "register-email",
                        placeholder: "Email",
                        disabled: busy,
                        type: "email",
                    }),
                    EmptyBox({ height: "10px" }),
                    InputField({
                        state: "register-username",
                        placeholder: "Username",
                        disabled: busy,
                    }),
                    EmptyBox({ height: "10px" }),
                    InputField({
                        state: "register-password",
                        placeholder: "Password",
                        type: "password",
                        disabled: busy,
                    }),
                    EmptyBox({ height: "10px" }),
                    InputField({
                        state: "register-repeat-password",
                        placeholder: "Repeat Password",
                        type: "password",
                        disabled: busy,
                    }),
                    EmptyBox({ height: "10px" }),
                    StandardButton({
                        text: "Register",
                        loading: busy,
                        onClick: () => {
                            register();
                        },
                        disabled: busy,
                    }),
                    StandardErrorText(error, { marginTop: "10px" }),
                    EmptyBox({ height: "20px" }),
                    StandardTextLink({
                        text: "Already have an account ? Login here !",
                        to: "/login",
                    }),
                ],
            }),
        ],
    });
};
