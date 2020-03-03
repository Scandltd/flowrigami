import Context from '@app/flow/Context';
import Diagram from '@app/flow/diagram/Diagram';
import Indicator from '@app/flow/diagram/Indicator';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';


export default class Library {
  private diagram: Diagram;
  private libraryElement: HTMLElement;
  private toggleControl: HTMLElement;

  constructor(context: Context, libraryElement: HTMLElement) {
    this.diagram = context.diagram;
    this.libraryElement = libraryElement;

    this.toggleControl = this.libraryElement.querySelector('.fl-panel-toggler') as HTMLElement;
    this.toggleControl.onclick = this.handleToggle;

    const documentFragment = document.createDocumentFragment();
    this.diagram.nodes.forEach((it) => {
      this.createNodeItem(documentFragment, it);
    });
    this.createItemsDivider(documentFragment);
    this.createIndicatorItem(documentFragment);

    this.libraryElement.appendChild(documentFragment);
  }

  private handleToggle = () => {
    this.libraryElement.classList.toggle('active');
  };

  private createNodeItem(documentFragment: DocumentFragment, nodeName: string) {
    const canvas = createCanvas();
    const tmpHookDiv = document.createElement('div');
    const nodeFactory = this.diagram.createNodeFactory(canvas, tmpHookDiv);

    const node = nodeFactory.getNode(nodeName, { x: 40, y: 35 });
    if (node) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      const child = document.createElement('div');
      child.classList.add('fl-library-item');
      child.appendChild(canvas);

      canvas.addEventListener('dragstart', (e) => {
        if (e.dataTransfer) {
          e.dataTransfer.setData('node', node.name);
        }
      });

      canvas.addEventListener('mousemove', (e) => {
        node.isHover = node.previewIncludes(new Coordinates(e.offsetX, e.offsetY));
        canvas.style.cursor = node.isHover ? 'pointer' : 'default';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        node.drawPreview();
      });

      canvas.addEventListener('mouseleave', (e) => {
        node.isHover = false;
        canvas.style.cursor = 'default';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        node.drawPreview();
      });

      node.drawPreview();

      documentFragment.appendChild(child);
    }
  }

  private createItemsDivider(documentFragment: DocumentFragment) {
    const hr = document.createElement('hr');
    hr.classList.add('fl-library-divider');
    documentFragment.appendChild(hr);
  }

  private createIndicatorItem(documentFragment: DocumentFragment) {
    const canvas = createCanvas();
    const htmlLevel = this.libraryElement.querySelector('div') as HTMLElement;

    const indicator = new Indicator(canvas, htmlLevel, { x: 40, y: 30, radius: 16 });
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const child = document.createElement('div');
    child.classList.add('fl-library-item');
    child.appendChild(canvas);

    canvas.addEventListener('dragstart', (e) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData('indicator', indicator.name);
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      indicator.isHover = indicator.includes(e.offsetX, e.offsetY);
      canvas.style.cursor = indicator.isHover ? 'pointer' : 'default';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      indicator.draw();
    });

    canvas.addEventListener('mouseleave', (e) => {
      indicator.isHover = false;
      canvas.style.cursor = 'default';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      indicator.draw();
    });

    indicator.draw();

    documentFragment.appendChild(child);
  }

  public unmount() {
    const library = this.libraryElement;
    while (library.firstChild) {
      library.removeChild(library.firstChild);
    }
  }
}

function createCanvas() {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.draggable = true;
  canvas.width = 80;
  canvas.height = 60;

  return canvas;
}
