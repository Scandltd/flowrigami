import Edge from '@app/_redesign/graph/Edge';
import Vertex from '@app/_redesign/graph/Vertex';


export default interface Graph {
  edges: Edge[];
  vertices: Vertex[];

  addVertex(vertex: Vertex): void;

  removeVertex(vertex: Vertex): void;

  addEdge(edge: Edge): void;

  removeEdge(edge: Edge): void;
}
