import { Column, Row, EmptyBox } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { mediaQueries } from "../../Style";
import PostCardLoading from "../Post/PostCardLoading";
import StandardLoadingSegment from "../Standard/StandardLoadingSegment";
import BannerLoading from "./CommunityBannerLoading";

export default () => {
    const theme = getTheme();

    return Column({
        children: [
            BannerLoading(),
            Row({
                style: { inline: { padding: "10px 50px" } },
                children: [
                    Column({
                        style: { inline: { flex: 1, marginRight: "10px" } },
                        children: [PostCardLoading(), PostCardLoading(), PostCardLoading()],
                    }),
                    Column({
                        style: {
                            className: "about-loading",
                            normal: {
                                minWidth: "300px",
                                maxWidth: "300px",
                                padding: "10px",
                                border: `1px solid ${theme.accent}`,
                                borderRadius: "2.5px",
                            },
                            mediaQueries: mediaQueries({ small: { normal: { display: "none" } } }),
                        },
                        children: [
                            Column({
                                children: [
                                    StandardLoadingSegment("1em"),
                                    EmptyBox({ height: "10px" }),
                                    StandardLoadingSegment("0.7em"),
                                    EmptyBox({ height: "10px" }),
                                    StandardLoadingSegment("10em"),
                                    EmptyBox({ height: "10px" }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
