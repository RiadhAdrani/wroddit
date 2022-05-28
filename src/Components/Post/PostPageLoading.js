import { Column, EmptyBox, Row } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { mediaQueries } from "../../Style";
import CommentLoadingView from "../Comment/CommentLoadingView";
import StandardLoadingSegment from "../Standard/StandardLoadingSegment";
import PostCardLoading from "./PostCardLoading";

export default () => {
    const theme = getTheme();

    return Column({
        style: {
            className: "post-page-loading",
            normal: {
                maxWidth: "900px",
                minWidth: "900px",
                alignSelf: "center",
                background: theme.primary,
                border: `1px solid ${theme.accent}`,
                padding: "30px",
                borderRadius: "2.5px",
            },
            mediaQueries: mediaQueries({
                medium: {
                    normal: {
                        maxWidth: "750px",
                        minWidth: "750px",
                        marginLeft: "10px",
                        marginRight: "10px",
                    },
                },
                small: {
                    normal: {
                        maxWidth: "calc(100vw - 30px)",
                        minWidth: "calc(100vw - 30px)",
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                    },
                },
            }),
        },
        children: [
            StandardLoadingSegment("30px"),
            EmptyBox({ height: "20px" }),
            PostCardLoading(),
            EmptyBox({ height: "20px" }),
            StandardLoadingSegment("60px"),
            EmptyBox({ height: "5px" }),
            Row({
                style: { inline: { justifyContent: "flex-end" } },
                children: [StandardLoadingSegment("30px", "60px")],
            }),
            EmptyBox({ height: "20px" }),
            CommentLoadingView(),
            EmptyBox({ height: "10px" }),
            CommentLoadingView(),
            EmptyBox({ height: "10px" }),
            CommentLoadingView(),
        ],
    });
};
