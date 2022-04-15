import React from "react";
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import Auth from "./Auth";
import Documents from "./pages/Documents";
import Document from "./Document";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route exact path="/" element={<Documents />} />
          </Route>
          <Route path="/login" element={<Auth />}></Route>
          <Route path="/documents/:id" element={<ProtectedRoute />}>
            <Route exact path="/documents/:id" element={<Document />} />
          </Route>
          <Route path="/documents" element={<ProtectedRoute />}>
            <Route exact path="/documents" element={<Documents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
