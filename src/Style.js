import { setStaticStyle } from "@riadh-adrani/recursive/style";

const mediaQueries = ({ medium = {}, small = {}, smaller = {}, tiny = {} }) => {
    return [
        { condition: "(max-width:1100px)", ...medium },
        { condition: "(max-width:850px)", ...small },
        { condition: "(max-width:600px)", ...smaller },
        { condition: "(max-width:400px)", ...tiny },
    ];
};

const globalStyle = () =>
    setStaticStyle({
        import: [
            `url(${"https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"})`,
        ],
        selectors: {
            "*": {
                fontFamily: "Open Sans , sens-serif",
                color: "inherit",
                backgroundColor: "inherit",
                boxSizing: "border-box",
            },
            "#root": {
                flex: 1,
                display: "flex",
                flexDirection: "column",
            },
            p: { margin: "0px" },
            body: {
                margin: "0px",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            },
            "h1,h2,h3,h4,h5,h6": {
                fontFamily: "Ubuntu",
                margin: "0px",
                padding: "5px 0px",
            },
            ".loading-gradient": {
                background: "white",
                backgroundPosition: "0% 33%",
                backgroundSize: "300% 300%",
                animation: "gradient 2s linear infinite",
                borderRadius: "2.5px",
            },
        },
        animations: {
            gradient: {
                "0%": { backgroundPosition: "0% 0%" },
                "100%": { backgroundPosition: "100% 0%" },
            },
            fadeIn: {
                "0%": { opacity: 0 },
                "100%": { opacity: 1 },
            },
            slideDownFading: {
                "0%": {
                    opacity: 0,
                    transform: "translateY(-10px)",
                },
                "100%": {
                    opacity: 1,
                    transform: "translateY(0px)",
                },
            },
        },
    });

export { globalStyle, mediaQueries };
