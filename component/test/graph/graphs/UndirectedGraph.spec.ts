import Edge from '@app/graph/Edge';
import Graph from '@app/graph/Graph';
import UndirectedGraph from '@app/graph/graphs/UndirectedGraph';
import Vertex from '@app/graph/Vertex';
import { expect } from 'chai';


describe(`Graph: ${UndirectedGraph.name}`, () => {
  let graph: Graph;
  let vertex1: Vertex;
  let vertex2: Vertex;
  let vertex3: Vertex;
  let edge12: Edge;

  beforeEach(() => {
    graph = new UndirectedGraph();
    vertex1 = new Vertex();
    vertex2 = new Vertex();
    vertex3 = new Vertex();
    edge12 = new Edge(vertex1, vertex2);

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addVertex(vertex3);
    graph.addEdge(edge12);
  });

  it('should not contain not added vertex', () => {
    const vertex4 = new Vertex();

    expect(graph.vertices).not.contains(vertex4);
  });

  it('should add vertex', () => {
    const vertex4 = new Vertex();
    graph.addVertex(vertex4);

    expect(graph.vertices).contains(vertex4);
  });

  it('should remove vertex', () => {
    graph.removeVertex(vertex2);

    expect(graph.vertices).not.contains(vertex2);
    expect(graph.edges).not.contains(edge12);
    expect(vertex1).not.contains(edge12);
  });

  it('should throw an error when adding already added vertex', () => {
    expect(() => graph.addVertex(vertex1)).to.throw();
  });

  it('should throw an error when removing not added vertex', () => {
    const vertex4 = new Vertex();

    expect(() => graph.removeVertex(vertex4)).to.throw();
  });

  it('should not contain not added edge', () => {
    const edge13 = new Edge(vertex1, vertex3);

    expect(graph.edges).not.contains(edge13);
    expect(vertex1.edges).not.contains(edge13);
    expect(vertex3.edges).not.contains(edge13);
  });

  it('should add edge', () => {
    const edge13 = new Edge(vertex1, vertex3);
    graph.addEdge(edge13);

    expect(graph.edges).contains(edge13);
    expect(vertex1.edges).contains(edge13);
    expect(vertex3.edges).contains(edge13);
  });

  it('should remove edge', () => {
    graph.removeEdge(edge12);

    expect(graph.edges).not.contains(edge12);
    expect(vertex1.edges).not.contains(edge12);
    expect(vertex2.edges).not.contains(edge12);
  });

  it('should throw an error when adding already added edge', () => {
    expect(() => graph.addEdge(edge12)).throw();
  });

  it('should throw an error when adding edge with not added vertices', () => {
    const vertex4 = new Vertex();
    const edge14 = new Edge(vertex1, vertex4);

    expect(() => graph.addEdge(edge14)).throw();
  });

  it('should throw an error when removing not added edge', () => {
    const edge13 = new Edge(vertex1, vertex3);

    expect(() => graph.removeEdge(edge13)).throw();
  });
});
