import AppContainer from "./components/AppContainer/AppContainer.js";

const appRoutes = [
    {
        path: "",
        props: {
            "content": "main"
        },
        component: AppContainer
    },
    {
        path: "/admin/fonts/view/all",
        props: {
            "content": "fonts"
        },
        component: AppContainer
    },
    {
        path: "/admin/fonts/view/:id",
        props: {
            "content": "font"
        },
        component: AppContainer
    }
    /* ADD MORE ROUTES HERE */
];

export default appRoutes; 