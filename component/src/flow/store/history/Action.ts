export default interface Action {
  execute: () => void;

  revert: () => void;
}
