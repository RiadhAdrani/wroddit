import { BorderSpinner, Column, H5 } from "@riadh-adrani/recursive/components";
import { setState, updateAfter, getState } from "@riadh-adrani/recursive/state";
import { getSearchResult } from "../../Models/Cloud";
import { getTheme } from "../../Models/Theme";
import CommunityCard from "./CommunityCard";
import StandardTextButton from "../Standard/StandardTextButton";
import StandardTextField from "../Standard/StandardTextField";
import { mediaQueries } from "../../Style";

export default () => {
    const [] = setState("query", "");
    const [result, setResult] = setState("result", { result: {}, show: false });
    const [show, setShow] = setState("show-result", false);
    const theme = getTheme();

    const communities = result.result.communities || [];
    const users = result.result.user || [];

    function hasResult() {
        return communities.length > 0 || users.length > 0;
    }

    function doShow() {
        const [doShow] = getState("show-search-only");

        return doShow;
    }

    return Column({
        style: {
            className: "sticky-search",
            normal: { width: "300px" },
            mediaQueries: mediaQueries({
                small: { normal: { display: doShow() ? "flex" : "none", width: "auto" } },
            }),
        },
        events: {
            onClickGlobal: () => {
                setShow(false);
            },
        },
        children: [
            StandardTextField({
                state: "query",
                placeholder: "Search",
                onFocus: () => {
                    setShow(true);

                    if (!hasResult()) {
                        setShow(false);
                    }
                },
                onInput: (e) => {
                    if (e.target.value.trim().length < 3) {
                        setResult({ result: {}, loading: false });
                        setShow(false);
                        return;
                    } else {
                        const q = e.target.value.trim();
                        setResult({ result: {}, loading: true });
                        setShow(true);

                        getSearchResult(q).then((res) => {
                            if (q == e.target.value.trim())
                                updateAfter(() => {
                                    setResult({
                                        result: res,
                                        loading: false,
                                    });
                                    setShow(true);
                                });
                        });
                    }
                },
            }),
            Column({
                flags: {
                    renderIf: show,
                },
                style: {
                    className: "query-result",
                    normal: {
                        position: "fixed",
                        top: "50px",
                        marginTop: "5px",
                        padding: "10px",
                        // border: `1px solid ${theme.accent}`,
                        borderRadius: "2.5px",
                        width: "278px",
                        background: theme.secondary,
                        boxShadow: `0px 0px 5px 0px ${theme.accent}`,
                        zIndex: 10,
                    },
                    mediaQueries: mediaQueries({ small: { normal: { right: "10px" } } }),
                },
                children: [
                    StandardTextButton({
                        text: "Close",
                        style: { marginLeft: "auto", marginBottom: "10px" },
                        onClick: () => setShow(false),
                    }),
                    result.loading
                        ? Column({
                              children: BorderSpinner({
                                  size: "1em",
                                  thickness: "2px",
                                  color: theme.accentTertiary,
                              }),
                              style: {
                                  className: "search-loader",
                                  normal: { alignItems: "center", marginBottom: "5px" },
                              },
                          })
                        : !hasResult()
                        ? H5({ text: "There are no result for this query !🤨 " })
                        : Column({
                              children: communities.map((community) =>
                                  CommunityCard({
                                      community,
                                      onClick: () => setShow(false),
                                  })
                              ),
                          }),
                ],
            }),
        ],
    });
};
