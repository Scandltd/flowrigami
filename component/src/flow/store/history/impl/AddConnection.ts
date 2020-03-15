import Link from '@app/flow/diagram/Link';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class AddConnection implements Action {
  private store: Store;
  private link: Link;

  constructor(store: Store, connection: Link) {
    this.store = store;
    this.link = connection;
  }

  execute = () => {
    this.store.addLink(this.link);
  };

  revert = () => {
    this.store.deleteLinkById(this.link.id);
  };
}
