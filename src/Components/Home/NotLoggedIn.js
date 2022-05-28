import { Column, EmptyBox, H3, P, Row } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import StandardButtonLink from "../Standard/StandardButtonLink";

export default () => {
    const [user] = getState("user");
    const theme = getTheme();

    return Column({
        flags: { renderIf: user == null },
        style: {
            className: "not-logged",
            normal: {
                alignSelf: "center",
                marginBottom: "20px",
                padding: "10px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "2.5px",
                alignItems: "center",
            },
        },
        children: [
            H3({ text: "You are not logged in at the moment !" }),
            EmptyBox({ height: "10px" }),
            P({ text: "Login or Register to start using Wroddit at its fullest." }),
            EmptyBox({ height: "10px" }),
            Row({
                children: [
                    StandardButtonLink({ text: "Login", to: "/login" }),
                    EmptyBox({ width: "10px" }),
                    StandardButtonLink({ text: "Register", to: "/register" }),
                ],
            }),
        ],
    });
};
