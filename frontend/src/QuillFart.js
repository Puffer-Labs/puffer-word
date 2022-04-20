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

const QuillFart = () => {
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
    let quill1 = new Quill("#editor1", options);
    let quill2 = new Quill("#editor2", options);

    const cursorOne = quill1.getModule("cursors");
    const cursorTwo = quill2.getModule("cursors");

    cursorOne.createCursor("cursor", "User 2", "red");
    cursorTwo.createCursor("cursor", "User 1", "blue");

		quill1.on("text-change", textChangeHandler(quill2));
		quill2.on("text-change", textChangeHandler(quill1));

		quill1.on("selection-change", selectionChangeHandler(cursorTwo));
		quill2.on("selection-change", selectionChangeHandler(cursorOne));
  }, []);

  function textChangeHandler(quill) {
    return function (delta, oldDelta, source) {
      if (source === "user") {
        setTimeout(() => quill.updateContents(delta), 500);
      }
    };
  }

  function selectionChangeHandler(cursors) {
    // const debounceUpdate = debounce(updateCursor, 500);
    return function (range, oldRange, source) {
      if (source === "user") {
        updateCursor(range);
      } else {
				updateCursor(range);
      }
    };

    function updateCursor(range) {
      setTimeout(() => cursors.moveCursor("cursor", range), 500);
    }
  }

  return (
    <>
      <div
        style={{
          margin: "5%",
          border: "1px solid black",
        }}
      >
				<h1>User 1</h1>
        <div id="editor1" />
				<hr></hr>
				<h1>User 2</h1>
        <div id="editor2" />
      </div>
    </>
  );
};

export default QuillFart;
