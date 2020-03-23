import Link from '@app/flow/diagram/Link';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class AddLink implements Action {
  private store: Store;
  private link: Link;

  constructor(store: Store, link: Link) {
    this.store = store;
    this.link = link;
  }

  public redo = () => {
    this.store.addLink(this.link);
  };

  public undo = () => {
    this.store.deleteLinkById(this.link.id);
  };
}
