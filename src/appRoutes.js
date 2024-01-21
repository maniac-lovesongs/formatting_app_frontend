import AppContainer from "./components/AppContainer/AppContainer.js";

const appRoutes = [
    {
        path: "",
        props: {
            "content": "main",
            "parent": null
        },
        component: AppContainer
    },
    {
        path: "/admin/fonts/view/all",
        props: {
            "content": "admin.fonts",
            "parent": "admin"
        },
        component: AppContainer
    },
    {
        path: "/admin/fonts/view/:id",
        props: {
            "content": "admin.font",
            "parent": "admin"
        },
        component: AppContainer
    }
    /* ADD MORE ROUTES HERE */
];

export default appRoutes; 