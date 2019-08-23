import { Node } from "./Node";
import { range, randBetween } from "./helpers";
import { makeRandomVector } from "./canvasHelpers";
import { Vector } from "./Vector";

interface MouseState {
  location: Vector;
  isDown: boolean;
  newNode: null | Node;
  determiningMass: boolean; // whether we're currently determining mass or acceleration
}

interface State {
  nodes: Node[];
  mouseState: MouseState;
}

export const state: State = {
  nodes: [],
  mouseState: {
    location: Vector.origin,
    isDown: false,
    newNode: null,
    determiningMass: true // first mass then acceleration
  }
};

export function setNodes(newNodes: Node[]) {
  state.nodes = newNodes;
}

export function initialiseNodes() {
  state.nodes = range(
    750,
    () =>
      new Node(
        makeRandomVector(),
        2,
        new Vector(randBetween(-2, 2), randBetween(-2, 2))
      )
  );
}

export function mouseDownHandler(e: MouseEvent) {
  state.mouseState.location = new Vector(e.clientX, e.clientY);

  if (state.mouseState.newNode) {
    const { newNode, location } = state.mouseState;
    if (newNode.position.to(location).length > newNode.radius) {
      state.mouseState.determiningMass = false;
    }
  }
}

export function mouseUpHandler(e: MouseEvent) {
  state.mouseState.isDown = false;

  const { newNode } = state.mouseState;
  if (newNode) state.nodes.push(newNode);

  state.mouseState.newNode = null;
}
