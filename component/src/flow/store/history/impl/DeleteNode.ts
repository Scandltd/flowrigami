import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class DeleteNode implements Action {
  private store: Store;
  private node: Node;
  private links: Link[] = [];

  constructor(store: Store, node: Node, connections: Link[]) {
    this.store = store;
    this.node = node;
    this.links = connections;
  }

  execute = () => {
    this.store.deleteNodeById(this.node.id);
  };

  revert = () => {
    this.store.addNode(this.node);
    this.store.addLinks(this.links);
  };
}
