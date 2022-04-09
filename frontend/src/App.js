import React from "react";
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import Auth from "./Auth";
import Documents from "./Documents";
import Document from "./Document";
import ProtectedRoute from "./ProtectedRoute";


export default function App(){

  function selectionChangeHandler(cursor, id) {
    return function (range, oldRange, source) {
      if (range && source === "user") {
        console.log(range);
        fetch("http://localhost:8000/presence/" + id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(range),
        }).then((res) => {
          console.log(res);
        });
        // cursor.moveCursor(id, range);
      }
    };
  }

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route exact path='/' element={<Documents/>}/>
          </Route>
          <Route path="/login" element={<Auth/>}>
          </Route>
          <Route path="/documents/id" element={<ProtectedRoute />}>
          <Route exact path='/documents/id' element={<Document/>}/>
          </Route>
          <Route path="/documents" element={<ProtectedRoute />}>
          <Route exact path='/documents' element={<Documents/>}/>
          </Route>
          </Routes>
          </BrowserRouter>
    </div>
  );


};
