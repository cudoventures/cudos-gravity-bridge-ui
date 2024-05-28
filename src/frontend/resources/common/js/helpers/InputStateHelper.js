import { makeObservable, observable } from 'mobx';
import S from '../utilities/Main';

export default class InputStateHelper {

    keys: string[];
    // parentUpdate: () => void;
    parentChange: (key: string, value: string) => void;

    values: Map < string, string >;
    @observable errors: Map < string, boolean >;
    onChanges: Map < string, () => void >;

    constructor(keys: string[], parentUpdate = null, parentChange = null) {
        this.keys = keys;
        // this.parentUpdate = parentUpdate;
        this.parentChange = parentChange;

        this.values = new Map();
        this.errors = new Map();
        this.onChanges = new Map();

        this.keys.forEach((key) => {
            this.values.set(key, S.Strings.EMPTY);
            this.errors.set(key, false);
            this.onChanges.set(key, this.onChange.bind(this, key));
        });

        makeObservable(this);
    }

    setParentCallbacks(parentChange = null) {
        this.parentChange = parentChange;
    }

    onChange(key, value) {
        const cacheErrors = this.errors;
        this.errors = null;

        this.values.set(key, value);
        cacheErrors.set(key, value === S.Strings.EMPTY);
        if (this.parentChange !== null) {
            this.parentChange(key, value)
        }

        this.errors = cacheErrors;
        // this.parentUpdate();
    }

    updateValues(values) {
        this.keys.forEach((key, index) => {
            this.values.set(key, values[index]);
        });
    }

    getValues() {
        const cacheErrors = this.errors;
        this.errors = null;

        let valid = true;
        this.values.forEach((value, key) => {
            valid = valid && value !== S.Strings.EMPTY;
            cacheErrors.set(key, value === S.Strings.EMPTY);
        });

        this.errors = cacheErrors;
        if (valid === false) {
            // this.parentUpdate();
            return null;
        }

        return this.values;
    }

    isValid() {
        let valid = true;
        this.errors.forEach((value, key) => {
            valid = valid && !value;
        });
        return valid;
    }

    getValue(key) {
        const cacheErrors = this.errors;
        this.errors = null;

        const value = this.values.get(key);
        const valid = value !== S.Strings.EMPTY;
        cacheErrors.set(key, value === S.Strings.EMPTY);

        this.errors = cacheErrors;
        if (valid === false) {
            // this.parentUpdate();
            return null;
        }

        return value;
    }

}
