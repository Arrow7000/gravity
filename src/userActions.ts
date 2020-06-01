import { setNodes } from "./state";
import { Node } from "./Node";
import { getCanvasCentre } from "./canvasHelpers";
import { Vector } from "./Vector";
import { createLotsOfNodes, getCircularOrbitVelocity } from "./nodeHelpers";
import { G } from "./gravityForce";

// potentially add canvas size and center point as parameters in case they're useful in user actions
type UserAction = (nodes: Node[], canvasCentre: Vector) => Node[];

const applyUserAction = (userAction: UserAction) => () =>
  setNodes((nodes) => userAction(nodes, getCanvasCentre()));

export const makeOneNode = applyUserAction(() => [
  new Node(new Vector(400, 400)),
]);

export const makeBinarySystem = applyUserAction(() => {
  const mass = 15000;
  const xOffset = 122;
  const centre = getCanvasCentre();

  const left = new Node(centre.addX(-xOffset), mass, Vector.origin);
  const right = new Node(centre.addX(xOffset), mass, Vector.origin);

  const velocity = getCircularOrbitVelocity(left, right);

  const upVec = new Vector(0, velocity / 2).multiply(mass);
  const downVec = upVec.flipY();

  left.acceleration = upVec;
  right.acceleration = downVec;

  return [left, right];
});

export const makeBinaryBlackHoles = applyUserAction(() => {
  const mass = 1000000;
  const xOffset = 150;
  const centre = getCanvasCentre();
  const upVec = new Vector(0, -50000000);
  const downVec = upVec.flipY();
  const left = new Node(centre.addX(-xOffset), mass, upVec);
  const right = new Node(centre.addX(xOffset), mass, downVec);

  return [left, right];
});

export const addLots = applyUserAction((nodes) => [
  ...nodes,
  ...createLotsOfNodes(100),
]);
