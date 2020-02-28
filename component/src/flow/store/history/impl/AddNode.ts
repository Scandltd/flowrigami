import NodeShape from '@app/flow/diagram/NodeShape';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class AddNode implements Action {
  private store: Store;
  private node: NodeShape;

  constructor(store: Store, node: NodeShape) {
    this.store = store;
    this.node = node;
  }

  execute = () => {
    this.store.nodeList.push(this.node);
  };

  revert = () => {
    this.store.nodeList = this.store.nodeList.filter(node => node.id !== this.node.id);
  };
}
