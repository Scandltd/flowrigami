import Indicator from '@app/flow/diagram/common/Indicator';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class DeleteIndicator implements Action {
  private store: Store;
  private indicator: Indicator;

  constructor(store: Store, indicator: Indicator) {
    this.store = store;
    this.indicator = indicator;
  }

  execute = () => {
    this.store.deleteIndicatorById(this.indicator.id);
  };

  revert = () => {
    this.store.addIndicator(this.indicator);
  };
}
