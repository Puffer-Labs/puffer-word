import React from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";

//generate random client id
const getId = () => {
  return (
    "_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const cursors = {};

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
        ],
      },
    };
    let quill = new Quill("#editor", options);

    // Connect to the event source to listen for incoming operation changes
    const connection = new EventSource("http://localhost:8000/connect/" + id);

    // server -> client
    connection.onmessage = (event) => {
      /**
       * There are 2 types of events that can be received:
       * 1. {data: {content: oplist}} This is the initial state of the editor.
       * 2. {data: array_of_oplists} This is the list of operations that have been applied to the document.
       */
      const data = JSON.parse(event.data);
      if (data.cursor) {
        if (cursors[data.cursor.id]) {
          cursors[data.cursor.id].moveCursor(data.cursor.range);
        } else {
          const cursor = quill.getModule("cursors");
          cursor.createCursor(data.cursor.id, data.cursor.id, "red");
          cursors[data.cursor.id] = cursor;
        }
      } else if (data.content) {
        quill.setContents(data.content);
      } else {
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

    quill.on("selection-change", selectionChangeHandler(cursors[id], id));

    // When the component is unmounted, we need to close the connection
    return () => {
      connection.close();
    };
  }, []);

  function selectionChangeHandler(cursor, id) {
    return function (range, oldRange, source) {
      if (range) {
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
        cursor.moveCursor(id, range);
      }
    };
  }

  return (
    <>
      <div
        style={{
          margin: "5%",
          border: "1px solid black",
        }}
      >
        <div id="editor" />
      </div>
    </>
  );
};

export default App;
