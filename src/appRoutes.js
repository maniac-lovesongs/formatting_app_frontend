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
        path: "/admin/fonts/view/:pageNumber",
        props: {
            "content": "fonts"
        },
        component: AppContainer
    }
    /* ADD MORE ROUTES HERE */
];

export default appRoutes; 