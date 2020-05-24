export interface IWebComponentTemplate {
	componentName: string,
	templateName?: string,
	template?: string
}

export function WebComponentDecorator(componentData: IWebComponentTemplate) {
	return function (constructor: CustomElementConstructor) {
		customElements.define(componentData.componentName, constructor); 
		Reflect.defineProperty(constructor.prototype, 'metadata', { value: { componentData: componentData } }); 
		return 
	}
}

export interface IInitiliseAsync { 
	InitAsync(): Promise<this>;
}
export function IsIInitiliseAsync(object: Object): object is IInitiliseAsync {
	return 'InitAsync' in object;
}

export interface IRenderFinished {
	RenderFinished(): void;
}
export function IsIRenderFinished(object: Object): object is IRenderFinished {
	return 'RenderFinished' in object;
}

export class WebComponent extends HTMLElement {

	constructor() {
		super();
	}

	connectedCallback() {
		console.log("'I was called by the connectedCallback!");

		if (IsIInitiliseAsync(this)) {
			this.InitAsync()
				.then(() => {
					this.RenderWebComponent(); 

					if (IsIRenderFinished(this))
						this.RenderFinished();
				})
				.catch(() => {
					console.log('Failed to Init component. // No Rendering will be done.');
				});
		}
		else {
			this.RenderWebComponent(); 
			if (IsIRenderFinished(this))
				this.RenderFinished();
		}            
	}

	attributeChangedCallback() {
		console.log('attribute has been changed!', this);
	}

	disconnectedCallback() {
		this.Destroy();
	}

	public RenderWebComponent() {
		console.log(`Rendering Component...`);

		let componentMetadata: IWebComponentTemplate = <IWebComponentTemplate>(<any>this).metadata.componentData;

		if (!Reflect.has(this, 'metadata'))
			throw 'Error: attempting to use a components Render(...) method without defining the component metadata. Ensure your component class has the @EDPComponentDecorator Decorator. (Note: Decorators are NOT inherited!)'

		if (componentMetadata.template) {
			this.innerHTML = componentMetadata.template;
		}
		else if (componentMetadata.templateName) {
			throw 'Not Yet Implemented.';
		}
		else
			throw 'Component Templating Error: Neither Template or templateName was defined.';   


	}

	public Destroy() {

	} 
}