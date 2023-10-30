/**
 * Assign a value to the string based property.
 * @param obj Object that contains the property to assign.
 * @param name Name of property. Can contain dot notation and array notation (or a combination of them).
 * @param value Value to assign once the function have walked to the correct property.
 */
export function assignValue(obj: any, name: string, value: any, valueAssigner?: (obj: any, value: any, arrayIndex?: number) => void): any {
    if (value === undefined || value == null){
        throw new Error("Value is not specified for " + name);
    }
    if (obj === null || obj === undefined){
        throw new Error("Object is not specified for " + name);
    }

    var parent = obj;
    var current = obj;
    var lastKey = '';
    let assigned = false;
    //let arrayIndex = -1;

    var nameParts = name.split('.');
    nameParts.forEach((key, partIndex) => {

        // This is an array item
        if (key.charAt(key.length - 1) == ']') {
            var pos = key.indexOf('[');
            var arrayIndex = -1;

            // Got an index specified.
            if (pos < key.length - 2) {
                const indexStr = key.substring(pos + 1, key.length - 1);
                arrayIndex = +indexStr;
            }

            // Remove []
            key = key.substring(0, pos);

            // Create array if items havent been appended before.
            if (!current.hasOwnProperty(key)) {
                current[key] = [];
            }

            if (arrayIndex == -1) {
                arrayIndex = current[key].length;
            }

            if (!current[key][arrayIndex]) {

                // final part, assign it directly.
                if (partIndex == nameParts.length - 1) {
                    if (valueAssigner) {
                        valueAssigner(current[key], parseValue(value), arrayIndex);
                    } else {
                        current[key][arrayIndex] = parseValue(value);
                    }

                    assigned = true;
                } else {
                    current[key][arrayIndex] = {};
                }

            }

            lastKey = key;
            console.log('assigning current ' + key, current[key]);
            parent = current[key]; // the array
            current = current[key][arrayIndex]; // array element

        } else {
            lastKey = key;
            if (!current.hasOwnProperty(key)) {
                current[key] = {};
            }

            parent = current;
            console.log('assigning current ' + key, current[key]);
            current = current[key];
        }
    });


    if (!assigned) {
        // we stopped at an object like "value" or "someObject[].item"
        if (valueAssigner) {
            valueAssigner(parent[lastKey], parseValue(value));
        } else {

            //console.log('obj length', Object.keys(parent[lastKey]));

            if (Object.keys(parent[lastKey]).length === 0) {
                parent[lastKey] = parseValue(value);

            } else if (Array.isArray(parent[lastKey])) {
                parent[lastKey].push(parseValue(value));
            } else {
                var old = parent[lastKey];
                parent[lastKey] = [old];
                parent[lastKey].push(parseValue(value));
            }

        }

    }

}

function parseValue(valueStr: any): any {
    console.log('parsing value', valueStr, typeof valueStr);
    if (!valueStr){
        throw new Error("not specified");
    }

    if (!isNaN(<any>valueStr)) {
        return +valueStr;
    } else if (typeof valueStr === "string" && valueStr.toLowerCase() == 'true') {
        return true;
    } else if (typeof valueStr === "string" && valueStr.toLowerCase() == 'false') {
        return false;
    }

    return valueStr;
}