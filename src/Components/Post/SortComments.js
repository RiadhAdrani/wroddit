import { EmptyBox, P, Row } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import StandardButton from "../Standard/StandardButton";
import StandardIcon from "../Standard/StandardIcon";

export default (controller) => {
    const theme = getTheme();

    return Row({
        style: {
            className: "sort-posts-view",
            normal: {
                padding: "10px",
                border: `1px solid ${theme.accent}`,
                marginBottom: "10px",
                alignItems: "center",
                borderRadius: "2.5px",
            },
        },
        children: [
            P({ text: "Sort by : " }),
            EmptyBox({ width: "10px" }),
            StandardButton({
                disabled: controller.sort == "new",
                text: [
                    StandardIcon({
                        fa: "fa-solid fa-arrow-up-short-wide",
                        style: { normal: { marginRight: "5px" } },
                    }),
                    "Newest",
                ],
                onClick: () => controller.sortComments("new"),
            }),
            EmptyBox({ width: "10px" }),
            StandardButton({
                disabled: controller.sort == "old",
                text: [
                    StandardIcon({
                        fa: "fa-solid fa-arrow-down-short-wide",
                        style: { normal: { marginRight: "5px" } },
                    }),
                    "Oldest",
                ],
                onClick: () => controller.sortComments("old"),
            }),
        ],
    });
};
