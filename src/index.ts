import { Vector, Rectangle, getRectanglePosition, Pos } from "./Vector";
import { Node } from "./Node";
import {
  Ctx,
  drawCircle,
  drawLineFromCenterToNode,
  drawMomentumArrow
} from "./drawing";
import { allCombinations, MouseState, notNull } from "./helpers";
import { getAttraction } from "./gravityForce";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as Ctx;

const getCanvasEnd = () => new Vector(ctx.canvas.width, ctx.canvas.height);

const mouseState: MouseState = {
  location: Vector.origin,
  isDown: false,
  newNode: null,
  determiningMass: true // first mass then acceleration
};

function sizeCanvasToWindow() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
}

sizeCanvasToWindow();

ctx.imageSmoothingEnabled = true;

const range = <T>(length: number, mapper: (i: number) => T) =>
  Array.from({ length }).map((_, i) => mapper(i));

const rand = (max: number) => Math.random() * max;

const randBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const makeRandomVector = () => {
  const canvEnd = getCanvasEnd();
  const horCenter = canvEnd.x / 2;
  const vertCenter = canvEnd.y / 2;
  const topLeft = new Vector(horCenter / 4, vertCenter / 4);
  const bottomRight = topLeft.multiply(7);
  return new Vector(
    randBetween(topLeft.x, bottomRight.x),
    randBetween(topLeft.y, bottomRight.y)
  );
};

function isOutOfView(v: Vector) {}

let nodes = range(100, () => new Node(makeRandomVector()));

window.onresize = sizeCanvasToWindow;

canvas.addEventListener("mousedown", e => {
  mouseState.location = new Vector(e.clientX, e.clientY);
  mouseState.isDown = true;

  mouseState.determiningMass = true;
  mouseState.newNode = new Node(
    mouseState.location,
    2,
    Vector.origin.add(new Vector(0.01, 0.01))
  );
});

canvas.addEventListener("mousemove", e => {
  mouseState.location = new Vector(e.clientX, e.clientY);

  if (mouseState.newNode) {
    const { newNode, location } = mouseState;
    if (newNode.position.to(location).length > newNode.radius) {
      mouseState.determiningMass = false;
    }
  }
});

canvas.addEventListener("mouseup", e => {
  mouseState.isDown = false;

  const { newNode } = mouseState;
  if (newNode) nodes.push(newNode);

  mouseState.newNode = null;
});

function onFrame(counter: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  allCombinations(nodes, (a, b) => {
    const forces = getAttraction(a, b);

    a.accelerate(forces.a);
    b.accelerate(forces.b);
  });

  const combinedNodes = nodes.reduce((combinedNodes: Node[], node: Node) => {
    const closeNodes = combinedNodes.filter(
      (thisNode: Node) =>
        node.position.to(thisNode.position).length <
        (node.radius + thisNode.radius) / 2
    );

    if (closeNodes.length < 1) {
      return [...combinedNodes, node];
    } else {
      const combinedNode = [...closeNodes, node].reduce(
        (combinedNode, closeNode) => {
          const totalMass = combinedNode.mass + closeNode.mass;
          const centerOfMass = combinedNode.position
            .multiply(combinedNode.mass)
            .add(closeNode.position.multiply(closeNode.mass))
            .divide(totalMass);

          const newNode = new Node(centerOfMass, totalMass);
          newNode.acceleration = combinedNode.acceleration.add(
            closeNode.acceleration
          );

          return newNode;
        }
      );

      const withoutCombined = combinedNodes.filter(
        thisNode => !closeNodes.includes(thisNode)
      );

      return [...withoutCombined, combinedNode];
    }
  }, []);

  const { newNode } = mouseState;
  if (newNode) {
    drawMomentumArrow(ctx, newNode);
    drawCircle(ctx, newNode);
  }

  nodes = combinedNodes;

  nodes.forEach(node => {
    drawCircle(ctx, node);
    // drawLineFromCenterToNode(ctx, node);

    node.momentumMove();
  });

  if (mouseState.isDown && newNode) {
    if (mouseState.determiningMass) {
      newNode.mass *= 1.05;
    } else {
      const oppositeVector = newNode.position
        .to(mouseState.location)
        .multiply(-1)
        .multiply(newNode.mass / 30);

      newNode.acceleration = oppositeVector;
    }
  }

  requestAnimationFrame(() => onFrame(counter + 1));
}

// Start it off
onFrame(0);
