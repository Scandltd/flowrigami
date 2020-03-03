import Context from '@app/flow/Context';
import Indicator from '@app/flow/diagram/Indicator';
import Node from '@app/flow/diagram/Node';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import { textareaChange } from '@app/flow/utils/HtmlUtils';


export default class PropertiesPanel {
  private store: Store;
  private propertiesPanel: HTMLElement;
  private propertiesPanelItems: HTMLElement;
  private propertiesPanelControl: HTMLElement;

  constructor(context: Context, propertiesPanel: HTMLElement) {
    this.store = context.store;

    this.propertiesPanel = propertiesPanel;
    this.propertiesPanelItems = propertiesPanel.querySelector('.fl-panel-items') as HTMLElement;
    this.propertiesPanelControl = this.propertiesPanel.querySelector('.fl-panel-toggler') as HTMLElement;
    this.propertiesPanelControl.onclick = this.handleToggle;

    this.store.subscribe(ACTION.SET_NODE, this.handleSetNode);
    this.store.subscribe(ACTION.ESCAPE, this.handleSetNode);
  }

  private handleToggle = () => {
    this.propertiesPanel.classList.toggle('active');
  };

  public handleSetNode = () => {
    this.hideProperties();
    const selectedShape = this.store.selectedIndicator || this.store.selectedNode;
    if (selectedShape) {
      this.displayProperties(selectedShape);
    }
  };

  private displayProperties = (shape: Indicator | Node) => {
    const panelBodyDocumentFragment = document.createDocumentFragment();

    const idLabel = this.createPropertyLabelElement('ID');
    const idValue = this.createPropertyValueElement(shape.id);
    const shapeIdElement = this.createPropertyElement([idLabel, idValue]);

    const id = `${performance.now()}`;
    const labelLabel = this.createPropertyLabelElement('Text', id);
    const labelTextarea = this.createPropertyTextareaElement(id, shape.label);
    labelTextarea.oninput = textareaChange((value) => {
      this.store.dispatch(ACTION.UPDATE_SHAPE_TEXT, { id: shape.id, text: value });
    });
    const shapeLabelElement = this.createPropertyElement([labelLabel, labelTextarea]);

    panelBodyDocumentFragment.appendChild(shapeIdElement);
    panelBodyDocumentFragment.appendChild(shapeLabelElement);

    this.propertiesPanelItems.appendChild(panelBodyDocumentFragment);
  };

  private createPropertyLabelElement = (label: string, attrFor?: string) => {
    const span = document.createElement('span');
    span.classList.add('fl-prop-label');
    span.innerText = label;

    if (attrFor) {
      span.setAttribute('for', attrFor);
    }

    return span;
  };

  private createPropertyValueElement = (innerText: string) => {
    const span = document.createElement('span');
    span.classList.add('fl-prop-value');
    span.innerText = innerText;

    return span;
  };

  private createPropertyTextareaElement = (id: string, value: string) => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('rows', '3');
    textarea.id = id;
    textarea.value = value;

    return textarea;
  };

  private createPropertyElement = (children: HTMLElement[]) => {
    const element = document.createElement('div');
    element.classList.add('fl-prop');
    children.forEach((it) => element.appendChild(it));

    return element;
  };

  private hideProperties = () => {
    const propertiesPanelItems = this.propertiesPanelItems;
    while (propertiesPanelItems.firstChild) {
      propertiesPanelItems.removeChild(propertiesPanelItems.firstChild);
    }
  };

  public unmount() {
    this.store.unsubscribe(ACTION.SET_NODE, this.handleSetNode);
  }
}
