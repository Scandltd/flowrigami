import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class DeleteNode implements Action {
  private store: Store;
  private node: Node;
  private links: Link[] = [];

  // @TODO implement getLinks method in store by node
  constructor(store: Store, node: Node, links: Link[]) {
    this.store = store;
    this.node = node;
    this.links = links;
  }

  public redo = () => {
    console.log(this.links);
    this.links = this.store.findAllLinksByNode(this.node);
    console.log(this.links);
    this.store.deleteNodeById(this.node.id);
  };

  public undo = () => {
    this.store.addNode(this.node);
    this.store.addLinks(this.links);
    this.links = [];
  };
}
