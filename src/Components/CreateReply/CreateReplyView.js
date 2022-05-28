import { Column, Row, TextArea } from "@riadh-adrani/recursive/components";
import { getTheme } from "../../Models/Theme";
import StandardButton from "../Standard/StandardButton";
import StandardIcon from "../Standard/StandardIcon";
import StandardMaxCharacters from "../Standard/StandardMaxCharacters";

export default (value, confirmText, disabled = false, actions) => {
    const theme = getTheme();

    const MAX_CHAR = 1000;

    return Column({
        style: {
            className: "create-reply",
            normal: {
                borderRadius: "2.5px",
                border: `1px solid ${theme.accent}`,
            },
        },
        children: [
            TextArea({
                value: value.slice(0, MAX_CHAR),
                placeholder: "What are your thoughs ?",
                events: { onInput: actions.onInput },
                disabled,
                maxLength: MAX_CHAR,
                style: {
                    className: "create-reply-view",
                    scoped: true,
                    normal: {
                        border: "none",
                        borderRadius: "2.5px",
                        resize: "vertical",
                        padding: "10px",
                    },
                    focus: {
                        outlineColor: theme.color,
                        outlineWidth: "1px",
                    },
                },
            }),
            Row({
                style: {
                    inline: {
                        padding: "10px 5px",
                        backgroundColor: theme.secondary,
                        borderRadius: "2.5px",
                        justifyContent: "flex-end",
                    },
                },
                children: [
                    StandardMaxCharacters(value.length, MAX_CHAR, {
                        alignSelf: "center",
                        marginRight: "10px",
                    }),
                    StandardButton({
                        text: [
                            StandardIcon({
                                fa: "fa-solid fa-reply",
                                style: { normal: { marginRight: "5px" } },
                            }),
                            confirmText,
                        ],
                        onClick: actions.reply,
                        disabled,
                        loading: disabled,
                    }),
                ],
            }),
        ],
    });
};
