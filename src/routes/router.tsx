import { createBrowserRouter } from "react-router";
import { MainLayout } from "../components/layout/main-layout";
import { ChatPage } from "../pages/chat";
import { Profile } from "../pages/profile";
import { SigninPage } from "../pages/signin";
import { SignupPage } from "../pages/signup";
import { PrivateRoute } from "./private-route";

export const router = createBrowserRouter([
  { path: "/signup", element: <SignupPage /> },
  { path: "/signin", element: <SigninPage /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <ChatPage /> },
          { path: "/chat/:chatId?", element: <ChatPage /> },
          { path: "/profile/:tab?", element: <Profile /> },
        ],
      },
    ],
  },
]);
