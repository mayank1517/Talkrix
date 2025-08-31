import { Routes, Route } from "react-router";
import ChatPage from "./Pages/ChatPage";
import NotificationPage from "./Pages/NotificationPage";
import HomePage from "./Pages/HomePage";
import ProfileCompletePage from "./Pages/ProfileCompletePage";
import VideoChatPage from "./Pages/VideoChatPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router";
import useAuth from "./Hooks/useAuth";
import Layout from "./Components/Layout";
import Friends from "./Pages/Friends";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const { user, loading } = useAuth();

  return (
    <div className="App">
      <Toaster />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute user={user}>
                <Layout>
                  <ChatPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute user={user}>
                <Layout>
                  <NotificationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-complete"
            element={user && <ProfileCompletePage />}
          />
          <Route
            path="/video-call/:callId"
            element={
              <ProtectedRoute user={user}>
                <Layout>
                  <VideoChatPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/friends"
            element={
              <ProtectedRoute user={user}>
                <Layout>
                  <Friends />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
