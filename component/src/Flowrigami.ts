import DiagramApi from '@app/flow/api/DiagramApi';
import IndicatorApi from '@app/flow/api/IndicatorApi';
import Main from '@app/flow/Main';
import FlowrigamiOptions from '@app/FlowrigamiOptions';


const DEFAULT_OPTIONS: FlowrigamiOptions = {
  viewMode: false
};

export default class Flowrigami {
  public diagramApi: DiagramApi;
  public indicatorApi: IndicatorApi;

  public unmount: () => void;

  constructor(root: HTMLElement, options: FlowrigamiOptions = DEFAULT_OPTIONS) {
    const main = new Main(root, options);

    this.diagramApi = main.diagramApi;
    this.indicatorApi = main.indicatorApi;

    this.unmount = () => {
      main.unmount();

      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }
    };
  }
}
