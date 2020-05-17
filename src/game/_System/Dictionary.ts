
import * as _ from 'lodash';

interface IDictionary<T> {
	[Key: string]: T;
}

/**
 * Represents a Dictionary with a string key and T value.
 */
export class Dictionary<T> {
	private _dictionaryObject: IDictionary<T>;

	get Keys():string[] {
		return _.keys(this._dictionaryObject);
	}
	
	get Values(): Array<T> {
		return _.values(this._dictionaryObject);
	}
	
	get Length(): number {
		return _.keys(this._dictionaryObject).length;
	}
	
	constructor() {
		this._dictionaryObject = Object.create(null);
	}

	public Add(key: string, value: T) {
		if (key == null)
			throw 'Argument Null: {"key"}';

		if (this.ContainsKey(key))
			throw 'An element with the key "' + key +'" already exists in the Dictionary. {"key"}';

		this.SetValue(key, value);
	}

	public SetValue(key: string, value: T) {
		this._dictionaryObject[key] = value;
	}

	public GetValue(key: string): T {
		let retVal: T;
		if (this.ContainsKey(key))
			retVal = this._dictionaryObject[key];
		else
			throw 'The specified key was not found. {"key"}';

		return retVal;
	}

	public GetValueOrNull(key: string): T {
		let retVal: T;
		if (this.ContainsKey(key))
			retVal = this._dictionaryObject[key];
		else
			retVal = null;

		return retVal;
	}

	public ContainsKey(key: string): boolean {
		return _.has(this._dictionaryObject, key);
	}

	public Clear() {
		this._dictionaryObject = Object.create(null);
	}

	public Remove(key: string): boolean {
		if (!this.ContainsKey(key)) {
			return false;
		}
		else {
			delete this._dictionaryObject[key];
			return true;
		}
	}  
}