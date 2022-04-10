import React from "react";
<<<<<<< HEAD
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import Auth from "./Auth";
import Documents from "./Documents";
import Document from "./Document";
import ProtectedRoute from "./ProtectedRoute";
=======
import Quill from "quill";
import QuillCursors from "quill-cursors";
import cursors from "./cursors";
import images from "./images";
import "quill/dist/quill.snow.css";
>>>>>>> 410457f (added image upload support)


<<<<<<< HEAD
export default function App(){
=======
const App = () => {
  React.useEffect(() => {
    Quill.register("modules/cursors", QuillCursors);
    const id = getId();
    const options = {
      theme: "snow",
      modules: {
        cursors: {
          transformOnTextChange: true,
        },
        toolbar: [
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "code-block",
          "link",
          "image",
        ],
      },
    };
    let quill = new Quill("#editor", options);

    //init this client's cursor
    cursors.init(quill);

    // Connect to the event source to listen for incoming operation changes
    const connection = new EventSource("http://localhost:8000/connect/" + id);

    // server -> client
    connection.onmessage = (event) => {
      /**
       * There are 3 types of events that can be received:
       * 1. {data: {content: oplist}} This is the initial state of the editor.
       * 2. {data: array_of_oplists} This is the list of operations that have been applied to the document.
       * 3. {data: {cursor: {connClosed: boolean, id: string, position: number}}} This is the cursor position of one of the clients that was updated.
       */
      const data = JSON.parse(event.data);
      if (cursors.isRemoteCursorEvent(data, id)) {
        cursors.processCursorEvent(data.cursor);
      } else if (data.content) {
        quill.setContents(data.content);
      } else {
        console.log(data);
        data.map((op) => quill.updateContents(op));
      }
    };

    // client -> server
    quill.on("text-change", (delta, oldDelta, source) => {
      /**
       * Whenever the user makes a change to the editor, we send latest OP to the server.
       */

      if (source === "user") {
        const op = delta.ops;
        fetch("http://localhost:8000/op/" + id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([op]),
        }).then((res) => {
          // console.log(res);
        });
      }
    });

    quill.on("selection-change", selectionChangeHandler(id));
    quill
      .getModule("toolbar")
      .addHandler("image", () => images.handleUpload(quill));

    // When the component is unmounted, we need to close the connection
    return () => {
      connection.close();
    };
  }, []);
>>>>>>> 410457f (added image upload support)

  function selectionChangeHandler(id) {
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
