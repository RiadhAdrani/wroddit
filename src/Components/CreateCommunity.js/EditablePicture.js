import { Img, P, Row } from "@riadh-adrani/recursive/components";
import { getState, setState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";

export default ({ state, size = 80, style = {}, editable = true, text = "Edit" }) => {
    const [data, setData] = getState(state);
    const [show, setShow] = setState(state + "-edit", false);
    const theme = getTheme();

    return Row({
        style: {
            inline: {
                alignItems: "center",
                justifyContent: "center",
                width: size + "px",
                height: size + "px",
                borderRadius: "50%",
                border: `3px solid ${theme.primary}`,
                backgroundColor: theme.accentSecondary,
            },
            className: "editable-profile-pciture-wrapper",
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
            Img({
                height: size,
                width: size,
                src: data.src,
                style: {
                    className: "editable-profile-pciture",
                    scoped: true,
                    normal: {
                        borderRadius: "50%",
                    },
                },
            }),
            Row({
                flags: { renderIf: show && editable },
                children: text,
                style: {
                    inline: {
                        fontWeight: "bold",
                        position: "fixed",
                        background: theme.accentTertiary + 88,
                        height: size + "px",
                        width: size + "px",
                        borderRadius: "50%",
                        color: "white",
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                },
                events: {
                    onClick: () => {
                        const inp = document.createElement("input");
                        inp.type = "file";

                        inp.onchange = () => {
                            setData({ file: inp.files[0], src: URL.createObjectURL(inp.files[0]) });
                        };

                        inp.click();
                    },
                },
            }),
        ],
    });
};
