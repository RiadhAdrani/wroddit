import { BorderSpinner, Button, Fragment } from "@riadh-adrani/recursive/components";
import { getState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import { mediaQueries } from "../../Style";
import StandardIcon from "../Standard/StandardIcon";

export default (controller) => {
    const theme = getTheme();

    const [user] = getState("user");
    const isIn = controller.hasUserJoinedCommunity();

    return Button({
        text: controller.loading
            ? BorderSpinner({ thickness: "2px", size: "0.8em", color: theme.primary })
            : isIn
            ? Fragment({
                  components: [
                      StandardIcon({
                          fa: "fa-solid fa-check",
                          style: { normal: { marginRight: "5px" } },
                      }),
                      "Leave",
                  ],
              })
            : Fragment({
                  components: [
                      StandardIcon({
                          fa: "fa-solid fa-plus",
                          style: { normal: { marginRight: "5px" } },
                      }),
                      "Join",
                  ],
              }),
        style: {
            className: "community-join-button",
            normal: {
                background: isIn ? theme.tertiary : theme.color,
                color: isIn ? "inherit" : "white",
                border: `1px solid ${theme.accent}`,
                marginLeft: "10px",
                borderRadius: "10px",
                padding: "5px 10px",
                cursor: "pointer",
            },
            hover: {
                opacity: 0.6,
            },
            active: {
                opacity: 0.9,
            },
            mediaQueries: mediaQueries({
                smaller: {
                    normal: {
                        marginLeft: "0px",
                        marginTop: "10px",
                    },
                },
            }),
        },
        events: {
            onClick: controller.onJoinButtonClicked,
        },
    });
};
