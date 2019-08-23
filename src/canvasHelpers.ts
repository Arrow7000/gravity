import { Vector, Rectangle, getRectanglePosition, Pos } from "./Vector";
import { randBetween } from "./helpers";

export type Ctx = CanvasRenderingContext2D;

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;

export const ctx = canvas.getContext("2d") as Ctx;

ctx.imageSmoothingEnabled = true;

export const getCanvasEnd = () =>
  new Vector(ctx.canvas.width, ctx.canvas.height);

export function sizeCanvasToWindow() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
}

export function makeRandomVector() {
  const canvEnd = getCanvasEnd();
  const horCenter = canvEnd.x / 2;
  const vertCenter = canvEnd.y / 2;
  const topLeft = new Vector(horCenter / 4, vertCenter / 4);
  const bottomRight = topLeft.multiply(7);
  return new Vector(
    randBetween(topLeft.x, bottomRight.x),
    randBetween(topLeft.y, bottomRight.y)
  );
}
