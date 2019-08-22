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

export function drawMomentumArrow(ctx: Ctx, node: Node, mouseLocation: Vector) {
  const { x, y } = node.position;
  // const center = getCanvasCenter(ctx);
  ctx.beginPath();
  ctx.moveTo(x, y);

  const momentumVec = node.acceleration.unit
    .multiply(mouseLocation.subtract(node.position).length)
    .add(node.acceleration.unit.multiply(node.radius));

  const momentum = node.position.add(momentumVec);

  const momentumTip = node.position.add(momentumVec.addLen(20));

  const thickness = Math.log(node.mass);

  ctx.lineTo(momentum.x, momentum.y);
  ctx.strokeStyle = "purple";
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.translate(momentumTip.x, momentumTip.y);
  ctx.rotate(node.acceleration.angle + Math.PI / 2);
  ctx.moveTo(0, 0);
  ctx.lineTo(thickness / 2 + 5, 20);
  ctx.lineTo(-(thickness / 2 + 5), 20);
  ctx.closePath();
  ctx.restore();
  ctx.fillStyle = "purple";
  ctx.fill();
}
