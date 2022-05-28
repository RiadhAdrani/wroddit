import { I } from "@riadh-adrani/recursive/components";

export default ({ fa, style = {} }) => {
    return I({
        className: fa,
        style: {
            className: "standard-fa-icon",
            scoped: true,
            inline: { fontSize: "1em" },
            ...style,
        },
    });
};
