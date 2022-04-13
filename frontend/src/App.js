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
const LOCALHOST_API = "http://localhost:8000";
const PUBLIC_API = "http://10.1.239.193:8000";
const API = LOCALHOST_API;

//generate random client id
const getId = () => {
  return (
    "_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const App = () => {
  const [id, setId] = React.useState(getId());
  const [cursorsList, setCursorsList] = React.useState([id]);
  // const [version, setVersion] = React.useState(0);

  React.useEffect(() => {
    Quill.register("modules/cursors", QuillCursors);
    let version = 0;
    //get docId from this component's url
    const docId = window.location.pathname.split("/").pop();
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
    const connection = new EventSource(`${API}/doc/connect/${docId}/${id}`);

    // server -> client
    connection.onmessage = (event) => {
      /**
       * There are 3 types of events that can be received:
       * 1. {data: {content: oplist}} This is the initial state of the editor.
       * 2. {data: array_of_oplists} This is the list of operations that have been applied to the document.
       * 3. {data: {cursor: {connClosed: boolean, id: string, position: number}}} This is the cursor position of one of the clients that was updated.
       */
      const data = JSON.parse(event.data);
      console.log("On message", data);
      if (cursors.isRemoteCursorEvent(data, id)) {
        cursors.processCursorEvent(data, addToList, removeFromList);
      } else if (data.content) {
        console.log(data);
        quill.setContents(data.content);
        version = data.version;
      } else if (data.ack) {
        version += 1;
      } else {
        quill.updateContents(data.op);
        version += 1;
      }
    };

    // client -> server
    quill.on("text-change", (delta, oldDelta, source) => {
      /**
       * Whenever the user makes a change to the editor, we send latest OP to the server.
       */

      if (source === "user") {
        const op = delta.ops;
        
        fetch(`${API}/doc/op/${docId}/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({op, version: version}),
        }).then((res) => {
          // console.log(res);
        });
      }
    });

    quill.on("selection-change", selectionChangeHandler(docId, id));
    quill
      .getModule("toolbar")
      .addHandler("image", () => images.handleUpload(quill));

    // When the component is unmounted, we need to close the connection
    return () => {
      connection.close();
    };
  }, []);

  function addToList(id) {
    if (!cursorsList.includes(id)) {
      setCursorsList((prev) => [...prev, id]);
    }
  }

  function removeFromList(id) {
    setCursorsList((prev) => prev.filter((cursor) => cursor !== id));
  }
>>>>>>> 298118c (versioning now working)


export default function App(){

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
