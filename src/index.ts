import { Vector, Rectangle, getRectanglePosition, Pos } from "./Vector";
import { Node } from "./Node";
import { Ctx, drawCircle } from "./drawing";
import { allCombinations, MouseState } from "./helpers";
import { getAttraction } from "./gravityForce";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as Ctx;

let nodes: Node[] = [];
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
const makeRandomVector = () =>
  new Vector(rand(getCanvasEnd().x), rand(getCanvasEnd().y));

nodes = range(30, () => new Node(makeRandomVector()));

window.onresize = sizeCanvasToWindow;

function addNewNode(location: Vector) {
  if (nodes.filter(n => n.position.isEqual(location)).length < 1) {
    const wiggle = 20;
    const wiggleRoom = () => Math.random() * wiggle - wiggle / 2;
    const newLoc = location.add(new Vector(wiggleRoom(), wiggleRoom()));

    nodes.push(new Node(newLoc));
  }
}

canvas.addEventListener("mousedown", e => {
  mouseState.location = new Vector(e.clientX, e.clientY);
  mouseState.isDown = true;

  mouseState.determiningMass = true;
  mouseState.newNode = new Node(mouseState.location, 1, Vector.origin);
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

function combineNodes(a: Node, b: Node) {
  const areTouching =
    a.position.to(b.position).length < (a.radius + b.radius) / 2;

  if (areTouching) {
    const totalMass = a.mass + b.mass;
    const centerOfMass = a.position
      .multiply(a.mass)
      .add(b.position.multiply(b.mass))
      .divide(totalMass);

    const newNode = new Node(centerOfMass, totalMass);
    newNode.acceleration = a.acceleration.add(b.acceleration);

    nodes = nodes.filter(node => node !== a && node !== b).concat(newNode);
  }
}

function onFrame(counter: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  allCombinations(nodes, (a, b) => {
    const forces = getAttraction(a, b);

    a.accelerate(forces.a);
    b.accelerate(forces.b);

    combineNodes(a, b);
  });

  nodes.forEach(node => {
    drawCircle(ctx, node);

    node.momentumMove();
  });

  const { newNode } = mouseState;
  if (newNode) drawCircle(ctx, newNode);

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
