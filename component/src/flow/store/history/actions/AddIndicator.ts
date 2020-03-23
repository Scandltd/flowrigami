import Indicator from '@app/flow/diagram/common/Indicator';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class AddIndicator implements Action {
  private store: Store;
  private indicator: Indicator;

  constructor(store: Store, indicator: Indicator) {
    this.store = store;
    this.indicator = indicator;
  }

  public redo = () => {
    this.store.addIndicator(this.indicator);
  };

  public undo = () => {
    this.store.deleteIndicatorById(this.indicator.id);
  };
}
