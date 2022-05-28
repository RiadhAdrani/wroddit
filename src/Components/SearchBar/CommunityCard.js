import { Column, EmptyBox, H4, Img, P, Row } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import { goToCommunity } from "../../Models/Utility";

export default ({ community, onClick }) => {
    const theme = getTheme();

    return Row({
        style: {
            className: "community-card",
            normal: {
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "2.5px",
                border: `1px solid ${theme.accent}`,
                marginBottom: "5px",
                backgroundColor: theme.tertiary,
            },
            hover: { backgroundColor: theme.secondary },
        },
        events: {
            onClick: () => {
                onClick();
                goToCommunity(community.name);
            },
        },
        children: [
            Img({
                src: community.picture,
                width: 40,
                height: 40,
                style: {
                    inline: {
                        borderRadius: "50%",
                        boxShadow: `0px 0px 2px ${theme.accentTertiary}`,
                    },
                },
            }),
            EmptyBox({ width: "10px" }),
            Column({
                style: { inline: { flex: 1 } },
                children: [
                    H4({ text: community.title, style: { inline: { padding: "0px" } } }),
                    P({
                        text: `w/${community.name}`,
                        style: { inline: { fontSize: "0.8em", color: theme.accentTertiary } },
                    }),
                ],
            }),
        ],
    });
};
