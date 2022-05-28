import { Img, P, Row } from "@riadh-adrani/recursive/components";
import { getState, setState, updateAfter } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";

export default ({ state, height = "144px", style = {}, editable = true, text = "Edit" }) => {
    const [data, setData] = getState(state);
    const [show, setShow] = setState(state + "-edit", false);
    const theme = getTheme();

    return Row({
        style: {
            inline: {
                alignItems: "center",
                justifyContent: "center",
                height,
                backgroundImage: `url(${data.src})`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundColor: theme.accentSecondary,
                borderRadius: "2.5px",
            },
            className: "editable-banner-wrapper",
            scoped: true,
            normal: style,
        },
        events: {
            onMouseOver: () => {
                if (editable) setShow(true);
            },
            onMouseLeave: () => {
                if (editable) setShow(false);
            },
        },
        children: [
            Row({
                flags: { renderIf: show && editable },
                children: text,
                style: {
                    inline: {
                        fontWeight: "bold",
                        height: "100%",
                        width: "100%",
                        flex: 1,
                        background: theme.accentTertiary + 88,
                        color: "white",
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "2.5px",
                    },
                },
                events: {
                    onClick: () => {
                        const inp = document.createElement("input");
                        inp.type = "file";

                        inp.onchange = () => {
                            updateAfter(() => {
                                setData({
                                    file: inp.files[0],
                                    src: URL.createObjectURL(inp.files[0]),
                                });
                            });
                        };

                        inp.click();
                    },
                },
            }),
        ],
    });
};
