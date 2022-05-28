import { createRouter, route } from "@riadh-adrani/recursive/router";
import CommunityPage from "./Pages/CommunityPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import NotFound from "./Pages/NotFound";
import PostPage from "./Pages/PostPage";
import RegisterPage from "./Pages/RegisterPage";

export default () => {
    createRouter(
        route({
            name: "/",
            title: "Home | Wroddit",
            component: HomePage,
            subRoutes: [
                route({ name: "/404", component: NotFound, title: "Ooops ! Not found !" }),
                route({
                    name: "/w=:community;",
                    component: CommunityPage,
                    subRoutes: [
                        route({
                            name: "/post=:post;",
                            component: PostPage,
                        }),
                    ],
                }),
                route({
                    name: "/post=:post;",
                    component: PostPage,
                }),
                route({ name: "/login", title: "Login into Wroddit", component: LoginPage }),
                route({ name: "/register", title: "Join Wroddit", component: RegisterPage }),
            ],
        }),
        "wroddit",
        true
    );
};
