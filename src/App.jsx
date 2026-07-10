import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/auth/Login";
import Dashboard from "./page/dashboard/Home";

const routes = [
  {
    element: <Home></Home>,
    path: "/",
  },
  {
    element: <Login></Login>,
    path: "/login",
  },
  {
    element: <Dashboard></Dashboard>,
    path: "/dashboard",
  }
]


export default function App() {
  return (
    <Routes>
      {routes.map((r) => {
        return (
          <Route element={r.element} path={r.path}></Route>
        )
      })}
    </Routes>


  )


}