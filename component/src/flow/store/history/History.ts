import Action from '@app/flow/store/history/Action';


const HISTORY_SIZE = 20;

export default class History {
  private redoActions: Action[] = [];
  private undoActions: Action[] = [];

  public canRedo = () => this.redoActions.length !== 0;
  public canUndo = () => this.undoActions.length !== 0;

  public execute = (action: Action) => {
    // @TODO implement
    // action.redo();

    this.redoActions = [];
    this.undoActions.unshift(action);
    this.undoActions.splice(HISTORY_SIZE);
  };

  public redo = () => {
    const action = this.redoActions.shift();
    if (action) {
      action.redo();
      this.undoActions.unshift(action);
    }
  };

  public undo = () => {
    const action = this.undoActions.shift();
    if (action) {
      action.undo();
      this.redoActions.unshift(action);
    }
  };
}
