import { IBehaviourNode } from "./BehaviourNode";

/*
 * Represents a Tree of behaviours.
 */
export class BehaviourTree {

	public readonly RootNode: IBehaviourNode;

	constructor(rootNode: IBehaviourNode) {
		this.RootNode = rootNode;
	}

	
}