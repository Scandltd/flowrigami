export default interface Action {
  redo: () => void;

  undo: () => void;
}
