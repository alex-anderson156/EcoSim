/**
     * Represents a Globally Unique Identifier.
     */
    export class Guid {
        public static readonly Empty: Guid = Guid.Parse('00000000-0000-0000-0000-000000000000');

        private _value: string;
        get Value(): string { return this._value; }
        set Value(value: string) {
            this.AssertValidGuid(value);
            this._value = value;
        }

        public toString():string{
            return this._value;
        }

        public static NewGuid(): Guid {
            let newGuid = new Guid();

            newGuid.Value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16).toUpperCase();
            });
            return newGuid;
        }

        public static Parse(guid: string): Guid {
            let newGuid = new Guid();
            newGuid.Value = guid;
            return newGuid;
        }

        private AssertValidGuid(guid: string): void {
            if (!guid.match(/^[{|\(]?[0-9a-fA-F]{8}[-]([0-9a-fA-F]{4}[-]){3}[0-9a-fA-F]{12}[\)|}]?|[{|\(]?[0-9a-fA-F]{8}([0-9a-fA-F]{4}){3}[0-9a-fA-F]{12}[\)|}]?$/)) {
                throw 'Invalid GUID string.';
            }
        }
        
        /**
         * Equates this GUID to another GUID.
         * @param otherGUID the other GUID to compare it too.
         */
        public Equals(otherGUID: Guid) {
            return this.Value.toUpperCase() === otherGUID.Value.toUpperCase();
        }
    }