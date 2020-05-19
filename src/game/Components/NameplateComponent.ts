import { Component, IComponent } from "./_Component";

import { Group } from 'THREE';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'; 
import { WebComponentDecorator, WebComponent } from "../_System/_WebComponent";

import './NameplateComponent.scss';
import { Entity } from "../Entity";

//https://codepen.io/dwidomski/pen/KBzuo
@WebComponentDecorator({ 
	componentName: 'eco-nameplate',
	template: `
<div class="Nameplate">
	<div class="NameTag">Bugz</div>
	<div class="Components"> 
		<div class="Component Healthbar Hunger">
			<div class="bar">
				<div class="hit"></div> 
			</div>
			<div class="textWrapper">
				<div class="text">Hunger: 100%</div>
			</div>
		</div>
		<div class="Component Healthbar Thirst">
			<div class="bar">
				<div class="hit"></div>
			</div>
		<div class="textWrapper">
			<div class="text">Thirst: 100%</div>
		</div>
		</div> 
	</div>
</div>`
})
export class NameplateComponent extends WebComponent implements IComponent {
	protected _Key: string = 'NameplateComponent';
	public get Key(): string { return this._Key; }

	protected _AttachedEntity: Entity;
 
	constructor() {
		super(); 
	}
	 

	//#region WebComponent

	public AddWebComponent(): void {

	}

	//#endregion

	//#region IComponent

	public Render(group: Group): void {   
		const nt = new CSS3DObject(this);
		nt.position.y += 3;
		nt.scale.set(0.01, 0.01, 0.01);
		group.add(nt); 
	}

	public Update(): void { }

	/**
	 * Assigns this component to an Entity - used so the component can interact with the entity or world the entity inhabits.
	 * @param entity - The entity to attach this component to.
	 */
	public AttachToEntity(entity: Entity){
		this._AttachedEntity = entity;	
	}

	//#endregion IComponent 
}