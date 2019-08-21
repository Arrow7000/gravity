import { colour } from "./config";
import { Node } from "./Node";
import { Vector } from "./Vector";

export type Ctx = CanvasRenderingContext2D;

const getCanvasCenter = (ctx: Ctx) =>
  new Vector(ctx.canvas.width / 2, ctx.canvas.height / 2);

export function drawCircle(ctx: Ctx, node: Node) {
  const { x, y } = node.position;

  ctx.beginPath();

  ctx.arc(x, y, node.radius, 0, Math.PI * 2);

  if (node.isBlackHole) {
    ctx.fillStyle = "black";
  } else {
    ctx.fillStyle = colour;
  }
  ctx.fill();
}

// function intersectionWithRectangle(
//   [origin, end]: [Vector, Vector],
//   line: Vector
// ) {}

export function drawLineFromCenterToNode(ctx: Ctx, node: Node) {
  const { x, y } = node.position;
  const center = getCanvasCenter(ctx);
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "red";
  ctx.lineWidth = Math.log(node.mass);
  ctx.stroke();
}

export function drawMomentumArrow(ctx: Ctx, node: Node) {
  const { x, y } = node.position;
  // const center = getCanvasCenter(ctx);
  ctx.beginPath();
  ctx.moveTo(x, y);

  const momentum = node.position.add(
    node.acceleration
      .multiply(15)
      .divide(node.mass)
      .add(node.acceleration.unit.multiply(node.radius))
  );

  ctx.lineTo(momentum.x, momentum.y);
  ctx.strokeStyle = "purple";
  ctx.lineWidth = Math.log(node.mass);
  ctx.lineCap = "round";
  ctx.stroke();
}
