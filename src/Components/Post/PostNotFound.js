import { Column, EmptyBox, H1, H3, H2 } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";

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
            H1({ text: "404 Not Found !" }),
            H2({ text: "Sorry, We are unable to find the post you are looking for !" }),
            EmptyBox({ height: "10px" }),
            H3({
                text: "This post may have been deleted or may have never existed in the first place.",
            }),
        ],
    });
};
