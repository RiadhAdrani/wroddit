import { H1 } from "@riadh-adrani/recursive/components";

export default (controller) => {
    return H1({
        text: controller.community.title,
        style: {
            className: "community-heading-title",
            normal: { fontSize: "1.5em", padding: "0px" },
        },
    });
};
