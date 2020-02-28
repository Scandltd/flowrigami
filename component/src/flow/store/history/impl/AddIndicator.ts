import Indicator from '@app/flow/diagram/Indicator';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class AddIndicator implements Action {
  private store: Store;
  private indicator: Indicator;

  constructor(store: Store, indicator: Indicator) {
    this.store = store;
    this.indicator = indicator;
  }

  execute = () => {
    this.store.indicators.push(this.indicator);
  };

  revert = () => {
    this.store.indicators = this.store.indicators.filter(node => node.id !== this.indicator.id);
  };
}
