const LOCAL_STORAGE_KEY = 'mogul_storage';
const VERSION = 17;

const accountsJson = [
    jsonAccount('1', 'admin@reactphp.com'),
];

class StorageHelper {

    constructor() {
        this.version = VERSION;
        this.accountsJson = accountsJson;
    }

    static open() {
        const result = new StorageHelper();
        const json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (json !== null) {
            const storage = JSON.parse(json);
            if (storage.version === VERSION) {
                Object.assign(result, storage);
            } else {
                result.save();
            }
        }
        return result;
    }

    save() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this));
    }

}

const storageHelper = StorageHelper.open();
export default storageHelper;

function jsonAccount(accountId, email) {
    return {
        'accountId': accountId,
        'email': email,
    };
}
