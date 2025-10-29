import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout } from "../components/layout/auth-layout";
import { MainLayout } from "../components/layout/main-layout";
import { ChatPage } from "../pages/chat";
import { ChatHistoryPage } from "../pages/chat-history";
import { ErrorPage } from "../pages/error";
import { NewChatPage } from "../pages/new-chat";
import { NotFoundPage } from "../pages/not-found";
import { ProfilePage } from "../pages/profile";
import { ProjectPage } from "../pages/project";
import { ProjectsPage } from "../pages/projects";
import { SigninPage } from "../pages/signin";
import { SignupPage } from "../pages/signup";
import { PrivateRoute } from "./private-route";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/signup", element: <SignupPage /> },
      { path: "/signin", element: <SigninPage /> },
    ],
  },
  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Navigate to="/new" replace /> },
          { path: "/new", element: <NewChatPage /> },
          { path: "/chats/:chatId?", element: <ChatPage /> },
          { path: "/history", element: <ChatHistoryPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/:projectId", element: <ProjectPage /> },
          { path: "/profile/:tab?", element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: "/error", element: <ErrorPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
