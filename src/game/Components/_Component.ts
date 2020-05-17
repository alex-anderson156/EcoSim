import { Group } from 'THREE';
import { Entity } from "../Entity";



export abstract class Component {

	protected abstract _Key: string
	/**
	 * Gets or sets the key of the component
	 */
	public get Key(): string { return this._Key; }
	public set Key(value: string) { this._Key = value; }

	protected _AttachedEntity: Entity;
 
	constructor() {

	}
 
	/**
	 * Assigns this component to an Entity - used so the component can interact with the entity or world the entity inhabits.
	 * @param entity - The entity to attach this component to.
	 */
	public AttachToEntity(entity: Entity){
		this._AttachedEntity = entity;	
	}

	/**
	 * Renders any objects this Component requires to the Group for this Entity.
	 * @param group - the group to render any objects too.
	 */
	public abstract Render(group: Group): void;

	/**
	 * Updates the Component.
	 */
	public abstract Update(): void;
}