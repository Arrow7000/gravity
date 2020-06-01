import { Node } from "./Node";
import { Vector } from "./Vector";

interface MouseState {
  location: Vector;
  isDown: boolean;
  newNode: null | Node;
  determiningMass: boolean; // whether we're currently determining mass or acceleration
}

export interface State {
  nodes: Node[];
  mouseState: MouseState;
}

// state singleton
export const state: State = {
  nodes: [],
  mouseState: {
    location: Vector.origin,
    isDown: false,
    newNode: null,
    determiningMass: true, // first mass then acceleration
  },
};

type NodesSetter<T> = (currNodes: T[]) => T[];

type GenericSetter<T> = (thing: T) => T;

export function setNodes(newNodesOrSetter: Node[] | NodesSetter<Node>) {
  if (typeof newNodesOrSetter === "function") {
    state.nodes = newNodesOrSetter(state.nodes);
  } else {
    state.nodes = newNodesOrSetter;
  }
}

export function setState(newStateOrSetter: State | GenericSetter<State>) {
  if (typeof newStateOrSetter === "function") {
    const newState = newStateOrSetter(state);

    // @TODO: set all state fields automatically
    state.mouseState = newState.mouseState;
    state.nodes = newState.nodes;
  } else {
    state.mouseState = newStateOrSetter.mouseState;
    state.nodes = newStateOrSetter.nodes;
  }
}

export function mouseDownHandler(e: MouseEvent) {
  state.mouseState.location = new Vector(e.clientX, e.clientY);
  state.mouseState.isDown = true;

  state.mouseState.determiningMass = true;
  state.mouseState.newNode = new Node(
    state.mouseState.location,
    2,
    Vector.origin.add(new Vector(0.01, 0.01))
  );
}

export function mouseMoveHandler(e: MouseEvent) {
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

export function onFrameHandler() {
  const { newNode } = state.mouseState;

  if (state.mouseState.isDown && newNode) {
    if (state.mouseState.determiningMass) {
      newNode.mass *= 1.05;
    } else {
      const oppositeVector = newNode.position
        .to(state.mouseState.location)
        .multiply(-1)
        .multiply(newNode.mass / 30);

      newNode.acceleration = oppositeVector;
    }
  }
}
