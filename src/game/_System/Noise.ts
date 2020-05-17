export class Noise {

	private _Width: number;
	private _Height: number;

	private _Values: number[][];

	private _Persistence = .25;
	private _Octaves = 6;
	private _BaseScale = .05

	private _NoiseMapData: number[][];
 
	constructor(width: number, height: number, persistance: number = .25, octaves: number = 6, baseScale: number = 0.5){
		this._Persistence = persistance;
		this._Octaves = octaves;
		this._BaseScale = baseScale;

		this._Width = width;
		this._Height = height;

		this._Values = [[]];
		for(var y = 0; y < height; y++) {
			let array = new Array<number>();
			for(var x = 0; x < width; x++) {
				array[x] = Math.random() * 2 - 1;
			}

			this._Values[y] = array;
		}
	}
 
	private Noise(x: number, y: number) {
		x = Math.min(this._Width - 1, Math.max(0, x));
		y = Math.min(this._Height - 1, Math.max(0, y));
		return this._Values[x][y];
	}

	private Smoothing(x: number, y: number) {
		var corners = (this.Noise(x-1, y-1)+this.Noise(x+1, y-1)+this.Noise(x-1, y+1)+this.Noise(x+1, y+1) ) / 16;
		var sides   = ( this.Noise(x-1, y)  +this.Noise(x+1, y)  +this.Noise(x, y-1)  +this.Noise(x, y+1) ) /  8;
		var center  =  this.Noise(x, y) / 4;
		var total = corners + sides + center;
		return total;
	}
 
	private Interpolate(a: number, b: number, x: number) {
		var ft = x * 3.1415927;
		var f = (1 - Math.cos(ft)) * .5;
		return  a*(1-f) + b*f;
	}

	private InterpolateNoise(x: number, y: number) {
		let integer_X: number = Math.floor(x);
		let fractional_X: number = x - integer_X;

		let integer_Y: number = Math.floor(y);
		let fractional_Y: number = y - integer_Y;

		let v1 = this.Smoothing(integer_X,     integer_Y);
		let v2 = this.Smoothing(integer_X + 1, integer_Y);
		let v3 = this.Smoothing(integer_X,     integer_Y + 1);
		let v4 = this.Smoothing(integer_X + 1, integer_Y + 1);

		let i1 = this.Interpolate(v1 , v2 , fractional_X);
		let i2 = this.Interpolate(v3 , v4 , fractional_X);

		return this.Interpolate(i1 , i2 , fractional_Y);
	}

	public Generate() { 
		this._NoiseMapData = [[]];
		let max: number = 0, min: number = 0;
		for(var y = 0; y < this._Height; y++) {
			let array = new Array<number>();
			for(var x = 0; x < this._Width; x++) {
				var p = this._Persistence;
				var n = this._Octaves - 1;
				var noiseHeight = 0; 	

				for(var i = 0; i <= n; i++) {
					var frequency = Math.pow(2, i);
					var amplitude = Math.pow(p, i);
			
					noiseHeight += this.InterpolateNoise(x * this._BaseScale * frequency, y * this._BaseScale * frequency) * amplitude;
				}

				array[x] = noiseHeight;

				if(noiseHeight > max)
					max = noiseHeight;
				else if (noiseHeight < min)
					min = noiseHeight;
			} 	
			
			this._NoiseMapData[y] = array;
		}
		const clamp = (a: number, min: number = 0, max: number = 1) => Math.min(max, Math.max(min, a));
		const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));

		for(var y = 0; y < this._Height; y++) {
			for(var x = 0; x < this._Width; x++) {
				this._NoiseMapData[y][x] = invlerp(min, max, this._NoiseMapData[y][x]);
			}
		} 
	}

	public GetValue(x: number, y: number): number{
		return this._NoiseMapData[y][x];
	}
}