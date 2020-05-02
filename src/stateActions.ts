import { State, setNodes } from "./state";
import { Node } from "./Node";
import { createLots } from "./nodeHelpers";

export function initialiseNodes() {
  setNodes(createLots(750));
}

export function setCrashedNodes(state: State) {
  return state.nodes.reduce((combinedNodes: Node[], node: Node) => {
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
}
