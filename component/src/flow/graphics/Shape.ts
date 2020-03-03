export default interface Shape {
  id: string;
  name: string;
  isActive: boolean;
  isHover: boolean;

  draw(): void;

  export(): any;

  import(object: any): void;

  includes(x: number, y: number): boolean;

  move(dx: number, dy: number): void;
}
