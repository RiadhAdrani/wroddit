import { Column, EmptyBox } from "@riadh-adrani/recursive/components";
import StandardLoadingSegment from "../Standard/StandardLoadingSegment";

export default (id) => {
    return Column({
        style: { inline: { marginTop: "10px" } },
        id,
        children: [
            StandardLoadingSegment("0.7em"),
            EmptyBox({ height: "10px" }),
            Column({
                style: { inline: { paddingLeft: "15px" } },
                children: [
                    StandardLoadingSegment("2.5em"),
                    EmptyBox({ height: "10px" }),
                    StandardLoadingSegment("1em"),
                ],
            }),
        ],
    });
};
