import { Column, EmptyBox, H2, H3, H5, P, Row } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import { logOut } from "../../Models/Cloud";
import { getTheme } from "../../Models/Theme";
import StandardButtonIcon from "../Standard/StandardButtonIcon";

export default () => {
    const theme = getTheme();
    const [user, setUser] = getState("user");
    const [loading, setLoading] = setState("already-logged-in-loading", false);

    return Column({
        flags: { renderIf: user != null },
        style: {
            className: "already-logged-in",
            normal: {
                padding: "40px",
                border: `1px solid ${theme.accent}`,
                background: theme.secondary,
                borderRadius: "2.5px",
            },
        },
        children: [
            H2({ text: "Login ... What ?" }),
            H3({ text: "Maybe you are not supposed to be here ?" }),
            P({ text: "You're alraedy logged in !" }),
            EmptyBox({ height: "10px" }),
            Row({
                children: [
                    StandardButtonIcon({
                        text: "Go Home",
                        fa: "fa-solid fa-house",
                        onClick: () => goTo("/"),
                    }),
                    EmptyBox({ width: "10px" }),
                    StandardButtonIcon({
                        text: "Log out",
                        loading,
                        fa: "fa-solid fa-arrow-right-to-bracket",
                        onClick: () => {
                            setLoading(true);

                            logOut().then(() => {
                                updateAfter(() => {
                                    setUser(null);
                                    setLoading(false);
                                });
                            });
                        },
                    }),
                ],
            }),
        ],
    });
};
