import { H2 } from "@riadh-adrani/recursive/components";

export default (controller) => {
    return H2({
        text: `w/${controller.community.name}`,
        style: {
            className: "community-w-name",
            normal: { fontSize: "1em", padding: "0px", fontWeight: "400" },
        },
    });
};
