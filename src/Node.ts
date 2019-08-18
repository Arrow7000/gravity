import { Vector, Rectangle, getRectanglePosition, Pos } from "./Vector";

const wiggle = 100;
const wiggleRoom = () => Math.random() * wiggle - wiggle / 2;

export class Node {
  public acceleration: Vector;
  public mass: number;

  constructor(public position: Vector, mass?: number, acceleration?: Vector) {
    this.mass = mass ? mass : Math.random() * 100; // randomly assigned
    this.acceleration = acceleration
      ? acceleration
      : new Vector(wiggleRoom(), wiggleRoom());
  }

  accelerate(force: Vector) {
    this.acceleration = this.acceleration.add(force);
  }

  private moveBy(v: Vector) {
    this.position = this.position.add(v);
  }

  momentumMove() {
    this.moveBy(this.acceleration.divide(this.mass));
  }

  get isBlackHole() {
    return this.mass > 100000;
  }

  get radius() {
    return Math.sqrt(this.isBlackHole ? this.mass / 100000 : this.mass);
  }

  wallBounce(rect: Rectangle) {
    const pos = getRectanglePosition(this.position, rect);
    const bounceLoss = 0.25;

    switch (pos) {
      case Pos.TopLeft:
      case Pos.TopRight:
      case Pos.Top:
        if (this.acceleration.y < 0) {
          this.acceleration = this.acceleration.flipY().scaleY(1 - bounceLoss);
        }
        break;

      case Pos.BottomLeft:
      case Pos.Bottom:
      case Pos.BottomRight:
        if (this.acceleration.y > 0) {
          this.acceleration = this.acceleration.flipY().scaleY(1 - bounceLoss);
        }
        break;

      case Pos.Left:
        if (this.acceleration.x < 0) {
          this.acceleration = this.acceleration.flipX().scaleX(1 - bounceLoss);
        }
        break;

      case Pos.Right:
        if (this.acceleration.x > 0) {
          this.acceleration = this.acceleration.flipX().scaleX(1 - bounceLoss);
        }
        break;
    }
  }
}
