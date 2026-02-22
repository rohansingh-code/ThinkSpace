import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

import Homepage from "./pages/Homepage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 -z-10 h-full w-full px-5 py-24
        [background:radial-gradient(140%_120%_at_50%_10%,#171717_65%,#000_100%)]"
      />

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;
