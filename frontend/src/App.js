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
          <Route path="/" element={<Auth />}></Route>
          <Route path="/login" element={<Auth />}></Route>
          <Route exact path="/doc/edit/:id" element={<Document />} />
          <Route path="/home" element={<ProtectedRoute />}>
            <Route exact path="/home" element={<Documents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
