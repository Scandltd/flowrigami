import Node from '@app/flow/diagram/Node';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class AddNode implements Action {
  private store: Store;
  private node: Node;

  constructor(store: Store, node: Node) {
    this.store = store;
    this.node = node;
  }

  public redo = () => {
    this.store.addNode(this.node);
  };

  public undo = () => {
    this.store.deleteNodeById(this.node.id);
  };
}
