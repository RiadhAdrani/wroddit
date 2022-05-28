import { EmptyBox, P, Row } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import { mediaQueries } from "../../Style";
import StandardButton from "../Standard/StandardButton";
import StandardButtonIcon from "../Standard/StandardButtonIcon";
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
            mediaQueries: mediaQueries({ small: { normal: { justifyContent: "center" } } }),
        },
        children: [
            P({ text: "Sort by : " }),
            EmptyBox({ width: "10px" }),
            StandardButtonIcon({
                text: "New",
                fa: "fa-solid fa-arrow-up-short-wide",
                disabled: controller.sort == "new",
                onClick: () => controller.sortPosts("new"),
            }),
            EmptyBox({ width: "10px" }),
            StandardButtonIcon({
                text: "Old",
                fa: "fa-solid fa-arrow-down-short-wide",
                disabled: controller.sort == "old",
                onClick: () => controller.sortPosts("old"),
            }),
            EmptyBox({ width: "10px" }),
            StandardButtonIcon({
                text: "Hot",
                fa: "fa-solid fa-fire-flame-simple",
                disabled: controller.sort == "hot",
                onClick: () => controller.sortPosts("hot"),
            }),
        ],
    });
};
