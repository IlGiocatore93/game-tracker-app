import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Library } from "./pages/Library";
import { Achievements } from "./pages/Achievements";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/library" replace />} />
    </Routes>
  );
}

export default App;