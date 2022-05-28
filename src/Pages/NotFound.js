import { Column, H1, H2, H3, H4, Img, Link } from "@riadh-adrani/recursive/components";
import { getLogo, getTheme } from "../Models/Theme";

export default () => {
    const theme = getTheme();

    return Column({
        style: {
            className: "not-found-404",
            normal: {
                padding: "10px",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderRadius: "2.5px",
                fontSize: "30px",
                textAlign: "center",
            },
        },
        children: [
            Link({
                to: "/",
                children: Img({
                    src: getLogo(),
                    width: 100,
                    height: 100,
                    style: {
                        inline: {
                            padding: "10px",
                            border: `2px solid ${theme.accent}`,
                            borderRadius: "50%",
                        },
                    },
                }),
            }),
            H1({
                text: "404",
                style: {
                    inline: {
                        color: theme.accentTertiary,
                        borderBottom: `20px solid ${theme.accentSecondary}`,
                        marginBottom: "20px",
                        borderRadius: "2.5px",
                    },
                },
            }),
            H4({
                style: {
                    inline: {
                        fontWeight: "normal",
                        fontFamily: "Open Sans , sans-serif",
                        padding: "10px",
                    },
                },
                text: "This page you are looking for no longer exists or maybe didn't even exist at the first place.",
            }),
        ],
    });
};
