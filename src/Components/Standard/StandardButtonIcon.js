import { Span } from "@riadh-adrani/recursive/components";
import { mediaQueries } from "../../Style";
import StandardButton from "./StandardButton";
import StandardIcon from "./StandardIcon";

export default ({
    text,
    fa,
    onClick = () => {},
    loading = false,
    render = true,
    disabled = false,
}) => {
    return StandardButton({
        onClick,
        loading,
        render,
        disabled,
        text: [
            StandardIcon({
                fa,
                style: {
                    normal: {
                        marginRight: "5px",
                    },
                    mediaQueries: mediaQueries({ small: { normal: { marginRight: "0px" } } }),
                },
            }),
            Span({
                text,
                style: {
                    className: "button-icon-text",
                    mediaQueries: mediaQueries({ small: { normal: { display: "none" } } }),
                },
            }),
        ],
    });
};
