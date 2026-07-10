/** @format */

import { Route, Routes } from "react-router-dom";

import Login from "./page/auth/Login";
import Dashboard from "./page/dashboard";
import Home from "./page/Home";
import ModuleManagerPage from "./page/dashboard/ModuleManagerPage";
import GenericModulePage from "./page/dashboard/GenericModulePage";

const routes = [
    {
        element: <Home />,
        path: "/",
    },
    {
        element: <Login />,
        path: "/login",
    },
    {
        element: <Dashboard />,
        path: "/dashboard",
    },
    {
        element: <ModuleManagerPage />,
        path: "/dashboard/modules",
    },
    {
        element: <GenericModulePage />,
        path: "/dashboard/:module",
    },
];

export default function App() {
    return (
        <Routes>
            {routes.map((r) => {
                return <Route element={r.element} path={r.path}></Route>;
            })}
        </Routes>
    );
}
