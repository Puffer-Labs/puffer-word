import React from "react";
import Quill from "quill";
import Sharedb from "sharedb/lib/client";
import "quill/dist/quill.snow.css";
import richText from "rich-text";

Sharedb.types.register(richText.type);

const socket = new WebSocket("ws://192.168.1.12:8080");
const connection = new Sharedb.Connection(socket);

const document = connection.get("documents", "first");

const App = () => {
  React.useEffect(() => {
    document.subscribe(() => {
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
      quill.setContents(document.data);

      quill.on("text-change", (delta, oldDelta, source) => {
        if (source !== "user") {
          document.data = quill.getContents();
        } else {
          document.submitOp(delta, { source: quill });
        }
      });

      document.on("op", (op, source) => {
        if (source !== quill) {
          quill.updateContents(op);
        }
      });
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
