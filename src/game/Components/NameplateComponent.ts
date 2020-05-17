import { Component } from "./_Component";

import { Group } from 'THREE';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

import './NameplateComponent.scss';

//https://codepen.io/dwidomski/pen/KBzuo
export class NameplateComponent extends Component {
	protected _Key: string = 'NameplateComponent';
 
	constructor() {
		super(); 
	}

	public Render(group: Group): void { 
		
		const nameTag: HTMLElement = document.createElement('div');
		nameTag.textContent = 'Bugz';
		nameTag.className = 'Nameplate';

		nameTag.innerHTML = `<div class="Nameplate">
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


		const nt = new CSS3DObject(nameTag);
		nt.position.y += 3;
		nt.scale.set(0.01, 0.01, 0.01);
		group.add(nt);
		  
	}

	public Update(): void {
  
	}
	
}