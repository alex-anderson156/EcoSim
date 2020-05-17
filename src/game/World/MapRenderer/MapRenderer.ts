import { Geometry, Mesh, MeshLambertMaterial, Scene, BoxBufferGeometry } from 'THREE';
import { MapTileData, Region, World } from "../";
import { IMapRenderer } from './_IMapRenderer';
import { Dictionary } from '../../../game/_System/Dictionary';  

export class MapRenderer implements IMapRenderer { 
	private _RegionData: Dictionary<Region>;  

	constructor(regionData: Dictionary<Region>) {
		this._RegionData = regionData; 
	}

	public Render(world: World, scene: Scene): void {
		let geometry = new Geometry();
 
		let materials: Array<MeshLambertMaterial> = new Array<MeshLambertMaterial>();
		for(let region of this._RegionData.Values)		
			materials.push(new MeshLambertMaterial({color: region.Colour }));
		
		for(let z= 0; z < world.WorldDepth; z++) { 
			for(let x = 0; x < world.WorldWidth; x++) {			
				let tileData: MapTileData = world.GetTileData(x, z);
				
				let regionIndex = 0;
				for(let region of this._RegionData.Values) {
					if(tileData.Value < region.Level)
						break;

					regionIndex++;
				}

				let region = this._RegionData.Values[regionIndex];
				tileData.Region = region;
				let geometry = new BoxBufferGeometry(1, region.Name == 'Water' ? 0.9 : 1, 1); 
				geometry.computeVertexNormals();			
					
				let mesh = new Mesh(geometry, materials[regionIndex]);
				//mesh.castShadow = true;
				mesh.receiveShadow = true;
				mesh.position.set(x, .5, z);
				scene.add(mesh);	 
			}
		}

		geometry.computeFaceNormals();
		geometry.computeVertexNormals(); 
	}
}