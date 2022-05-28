import { getState } from "@riadh-adrani/recursive/state";
import logo from "../media/wroddit.png";
import logoDark from "../media/wroddit-dark.png";

class Theme {
    constructor({
        primary,
        secondary,
        tertiary,
        accent,
        accentSecondary,
        accentTertiary,
        text,
        color,
        name,
    }) {
        this.color = this.primary = primary;
        this.secondary = secondary;
        this.tertiary = tertiary;
        this.accent = accent;
        this.accentSecondary = accentSecondary;
        this.accentTertiary = accentTertiary;
        this.color = color;
        this.text = text;
        this.name = name;
    }
}

const Themes = {
    Light: new Theme({
        name: "light",
        primary: "#F8F9FA",
        secondary: "#E9ECEF",
        tertiary: "#DEE2E6",
        accent: "#CED4DA",
        accentSecondary: "#82848C",
        accentTertiary: "#6C757D",
        text: "black",
        color: "#6C757D",
    }),
    Dark: new Theme({
        name: "dark",
        primary: "#2B2F38",
        secondary: "#2F343E",
        tertiary: "#3B404B",
        accent: "#474B57",
        accentSecondary: "#585B66",
        accentTertiary: "#9799A0",
        text: "white",
        color: "#9799A0",
    }),
};

/**
 * The current theme
 * @returns {Theme} the current theme
 */
const getTheme = () => {
    return getState("theme")[0];
};

const getLogo = () => {
    return getTheme().name == "light" ? logo : logoDark;
};

const getGradient = () => {
    const theme = getTheme();

    return `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 16%, ${theme.tertiary} 33%, ${theme.tertiary} 44%, ${theme.secondary} 55%, ${theme.primary} 67%, ${theme.secondary} 84%, ${theme.tertiary} 100%)`;
};

export { Themes, getTheme, getGradient, getLogo };
