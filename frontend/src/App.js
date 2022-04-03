import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

//generate random id
const getId = () => {
  return (
    "_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const App = () => {
  React.useEffect(() => {
    const id = getId();
    const options = {
      theme: "snow",
      modules: {
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

    const connection = new EventSource("http://localhost:8000/connect/" + id);
    connection.onmessage = (event) => {
      console.log(event);
      const content = JSON.parse(event.data).content
        ? JSON.parse(event.data).content
        : JSON.parse(event.data);
      quill.updateContents(content);
    };

    quill.on("text-change", (delta, oldDelta, source) => {
      console.log(source);
      if (source === "user") {
        //send op to server with fetch
        const op = delta.ops;
        fetch("http://localhost:8000/op/" + id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(op),
        }).then((res) => {
          console.log(res);
        });
      }
    });

    return () => {
      connection.close();
    };
  }, []);
  return (
    <div
      style={{
        margin: "5%",
        border: "1px solid black",
      }}
    >
      <div id="editor" />
    </div>
  );
};

export default App;
