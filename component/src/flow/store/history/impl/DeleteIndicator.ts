import Indicator from '@app/flow/diagram/Indicator';
import Link from '@app/flow/diagram/Link';
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
    this.store.indicators = this.store.indicators.filter(node => node.id !== this.indicator.id);
  };

  revert = () => {
    this.store.indicators.push(this.indicator);
  };
}
