import { Column, Row, EmptyBox } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import StandardLoadingSegment from "../Standard/StandardLoadingSegment";

export default () => {
    const theme = getTheme();

    return Row({
        style: {
            inline: {
                height: "150px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "2.5px",
                marginBottom: "10px",
            },
        },
        children: [
            Column({
                style: {
                    className: "post-votes",
                    scoped: true,
                    normal: {
                        alignItems: "center",
                        padding: "10px",
                        backgroundColor: theme.secondary,
                    },
                },
                children: [
                    StandardLoadingSegment("0.8em", "20px"),
                    EmptyBox({ height: "5px" }),
                    StandardLoadingSegment("0.8em", "20px"),
                    EmptyBox({ height: "5px" }),
                    StandardLoadingSegment("0.8em", "20px"),
                ],
            }),
            Column({
                style: {
                    inline: {
                        borderLeft: `1px solid ${theme.tertiary}`,
                        flex: 1,
                        padding: "10px",
                    },
                },
                children: [
                    StandardLoadingSegment("1em"),
                    EmptyBox({ height: "5px" }),
                    StandardLoadingSegment("0.7em"),
                    EmptyBox({ height: "10px" }),
                    StandardLoadingSegment("5em"),
                ],
            }),
        ],
    });
};
