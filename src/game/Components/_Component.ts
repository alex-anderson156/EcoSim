import { Entity } from "../Entities/Entity";
import { Group } from 'THREE'

export interface IComponent {
	Key: string;

	/**
	 * Assigns this component to an Entity - used so the component can interact with the entity or world the entity inhabits.
	 * @param entity - The entity to attach this component to.
	 */
	AttachToEntity(entity: Entity): void;

	/**
	 * Renders any objects this Component requires to the Group for this Entity.
	 * @param group - the group to render any objects too.
	 */
	Render(group: Group): void;

	/**
	 * Updates the Component.
	 */
	Update(): void;
}


export abstract class Component implements IComponent {

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