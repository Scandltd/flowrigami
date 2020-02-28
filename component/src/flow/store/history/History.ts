import Action from '@app/flow/store/history/Action';


const HISTORY_SIZE = 20;

export default class History {
  private undoActions: Action[] = [];
  private redoActions: Action[] = [];

  public undo = () => {
    const action = this.undoActions.shift();

    if (action) {
      action.revert();
      this.archiveRedoAction(action);
    }
  };

  public redo = () => {
    const action = this.redoActions.shift();

    if (action) {
      action.execute();
      this.archiveUndoAction(action);
    }
  };

  public archiveAction = (action: Action) => {
    this.archiveUndoAction(action);
    this.redoActions = [];
  };

  public hasUndo = () => this.undoActions.length !== 0;
  public hasRedo = () => this.redoActions.length !== 0;

  private archiveUndoAction = (action: Action) => {
    this.undoActions.unshift(action);

    if (this.undoActions.length >= HISTORY_SIZE) {
      this.undoActions = this.undoActions.slice(0, HISTORY_SIZE);
    }
  };

  private archiveRedoAction = (action: Action) => {
    this.redoActions.unshift(action);

    if (this.redoActions.length >= HISTORY_SIZE) {
      this.redoActions = this.redoActions.slice(0, HISTORY_SIZE);
    }
  };
}
