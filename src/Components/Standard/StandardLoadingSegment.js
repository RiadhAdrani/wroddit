import { Div } from "@riadh-adrani/recursive/components";
import { getGradient } from "../../Models/Theme";

export default (height = "1em", width = "auto") => {
    return Div({
        className: "loading-gradient",
        style: {
            inline: {
                height,
                width,
                backgroundImage: getGradient(),
            },
        },
    });
};
