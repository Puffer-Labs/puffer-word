/**
 * Functions for dealing with cursors and cursor events.
 */
const isRemoteCursorEvent = (data, id) => data && data.cursor !== undefined && data.id !== id;

// Maps the cursor id to the cursor object.
const cursors = {};
const idToNameMap = {};
// Quill Cursor module for managing all cursors
let cursorModule;

/**
 *
 * @param {CursorData} cursorData - Incoming cursor data
 *
 * If there is no cursor in the cursors dictionary, then we create a new cursor.
 * Otherwise, we know it is an existing client cursor, so we need to process the event.
 */
const processCursorEvent = (data, add, remove) => {
  const clientCursor = cursors[data.id];
  if (data.cursor != null && !clientCursor) {
    create(data.id, data.cursor.name);
    add(data.cursor.name);
  } else {
    _processExistingClientCursor(data,remove);
  }
};

/**
 *
 * @param {CursorData} cursorData - Incoming cursor data
 * @param {Cursor} clientCursor - The client's cursor
 *
 * The incoming cursor data can request 2 actions:
 * 1. Update some remote client's cursor
 * 2. Disconnect a remote client's cursor
 */
const _processExistingClientCursor = (data, remove) => {
  if (data.cursor == null) {
    remove(idToNameMap[data.id]);
    disconnect(data.id);
  } else {
    const index = data.cursor.index;
    const length = data.cursor.length;
    move(data.id, {index, length});
  }
};

/**
 *
 * @param {Quill} quill - Quill editor instance
 *
 * Initializes the 'quill-cursors' module to work with the Quill editor.
 */
const init = (quill) => {
  cursorModule = quill.getModule("cursors");
};

/**
 *
 * @param {string} id - Remote client ID
 * @param {string} name - Remote client name
 *
 * Creates a new cursor for a remote client that has connected.
 * The remote cursor is added to the cursors dictionary.
 */
const create = (id, name) => {
  const { defaultName, color } = _generateMetadata();
  cursors[id] = cursorModule.createCursor(id, name, color);
  idToNameMap[id] = name;
  //initiate cursor position on page for new remote connection
  //move(id, { index: 0, length: 0 });
  cursorModule.update();
};

/**
 *
 * @param {string} id - Remote Client ID
 *
 * Once a remote client disconnects, we need to remove the cursor
 * from the cursors dictionary and from the module.
 */
const disconnect = (id) => {
  cursorModule.removeCursor(id);
  delete cursors[id];
  delete idToNameMap[id];
};

/**
 *
 * @param {string} id - Remote Client ID
 * @param {Range} range - The range of the cursor
 *
 * Update a remote client's cursor position.
 */
const move = (id, range) => {
  cursorModule.moveCursor(id, range);
};

/**
 *
 * @returns {string} - A random hex color
 */
const _generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const getCursors = () => cursors;

/**
 *
 * @returns {Tuple} - A random name and hex color
 */
const _generateMetadata = () => {
  const fruits = [
    { name: "Apple", color: "#e34234" },
    { name: "Banana", color: "#f0e442" },
    { name: "Cherry", color: "#4286f4" },
    { name: "Grape", color: "#4286f4" },
    { name: "Lemon", color: "#f0e442" },
    { name: "Orange", color: "#e34234" },
    { name: "Pear", color: "#4286f4" },
    { name: "Pineapple", color: "#f0e442" },
    { name: "Strawberry", color: "#e34234" },
  ];
  return fruits[Math.floor(Math.random() * fruits.length)];
};

module.exports = {
  isRemoteCursorEvent,
  processCursorEvent,
  init,
  create,
  disconnect,
  move,
  getCursors,
};
