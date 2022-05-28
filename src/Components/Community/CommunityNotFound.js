import { Column, EmptyBox, H3, P, Row } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import StandardButton from "../Standard/StandardButton";
import StandardButtonLink from "../Standard/StandardButtonLink";

export default () => {
    const theme = getTheme();

    return Column({
        style: {
            className: "community-not-found",
            normal: {
                alignSelf: "center",
                marginTop: "auto",
                marginBottom: "auto",
                padding: "20px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "2.5px",
                alignItems: "center",
            },
        },
        children: [
            H3({ text: "Sorry, We are unable to find a community with that name !" }),
            EmptyBox({ height: "10px" }),
            P({ text: "This community may have been deleted or have its name incorrect." }),
            EmptyBox({ height: "10px" }),
            Row({
                children: [
                    StandardButton({
                        text: "Create community",
                        onClick: () => {
                            const [user] = getState("user");

                            if (user) {
                                const [, setShow] = getState("new-community-show");
                                setShow(true);
                            } else {
                                goTo("/login");
                            }
                        },
                    }),
                    EmptyBox({ width: "10px" }),
                    StandardButtonLink({ text: "Home", to: "/" }),
                ],
            }),
        ],
    });
};
