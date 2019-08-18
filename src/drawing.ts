import { colour } from "./config";
import { Node } from "./Node";

export type Ctx = CanvasRenderingContext2D;

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
