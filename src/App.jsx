import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";

const routes = [
  {
    element: <Home></Home>,
    path: "/",
  }
]


export default function App() {
  return (
    <Routes>
      {routes.map((r, i) => {
        return (
          <Route element={r.element} path={r.path}></Route>
        )
      })}
    </Routes>


  )


}