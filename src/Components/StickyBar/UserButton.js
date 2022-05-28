import { Column, Div, H3, P } from "@riadh-adrani/recursive/components";
import { goTo } from "@riadh-adrani/recursive/router";
import { getState, setState } from "@riadh-adrani/recursive/state";
import { getTheme } from "../../Models/Theme";
import StandardButton from "../Standard/StandardButton";
import StandardButtonIcon from "../Standard/StandardButtonIcon";
import StandardButtonLink from "../Standard/StandardButtonLink";
import StandardIcon from "../Standard/StandardIcon";
import UserDialog from "./UserDialog";

export default () => {
    const [user] = getState("user");
    const theme = getTheme();

    const [show, setShow] = setState("show-user-dialog", false);

    return user
        ? Column({
              style: { inline: { position: "relative" } },
              events: {
                  onClickGlobal: () => setShow(false),
              },
              children: [
                  StandardButtonIcon({
                      text: "Profile",
                      fa: "fa-solid fa-user",
                      onClick: () => setShow(!show),
                  }),
                  UserDialog({ show }),
              ],
          })
        : StandardButtonIcon({
              text: "Login",
              fa: "fa-solid fa-arrow-right-to-bracket",
              onClick: () => goTo("/login"),
          });
};
