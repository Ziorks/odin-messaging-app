import App from "../App";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Users from "../pages/Users";
import User from "../pages/User";
import Conversations from "../pages/Conversations";
import Conversation from "../pages/Conversation";
import Login from "../pages/Login";
import EditProfile from "../pages/EditProfile";
import { Outlet } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "users",
        element: <Outlet />,
        children: [
          { index: true, element: <Users /> },
          { path: ":userId", element: <User /> },
        ],
      },
      {
        path: "conversations",
        element: <Outlet />,
        children: [
          { index: true, element: <Conversations /> },
          { path: ":conversationId", element: <Conversation /> },
        ],
      },
      {
        path: "my-profile",
        element: <EditProfile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];

export default routes;
