import { createBrowserRouter } from "react-router";
import { MainLayout } from "../components/layout/main-layout";
import { ChatPage } from "../pages/chat";
import { ChatHistoryPage } from "../pages/chat-history";
import { ProfilePage } from "../pages/profile";
import { ProjectPage } from "../pages/project";
import { ProjectsPage } from "../pages/projects";
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
          { path: "/history", element: <ChatHistoryPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/:projectId", element: <ProjectPage /> },
          { path: "/profile/:tab?", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
