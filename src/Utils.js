/**
 * Utilities and helpers for quizify
 */
export default class Utils {
    /**
     * Returns true if an object is empty, otherwise returns false
     * @param {Object|Array} item the item to test for emptiness
     */
    static IsEmpty(item) {
        if ((Object.keys(item).length === 0 && item.constructor === Object) || item.length <= 0)
            return true;
        return false;
    }

    /**
     * Retrieves all the properties of an object
     * @param {object} item the object to retrieve the properties of
     */
    static GetObjectProperties(item) {
        let props = [];
        for (let property in item) {
            if (item.hasOwnProperty(property))
                props.push(property);
        }
        return props;
    }

    /**
     * Checks if all the values provided are in the provider array, returns false a value is not found
     * @param {Array} arrayToCheck the array of value to check
     * @param {Array} arrayOfValues the values to look for in the array
     */
    static CheckAllValuesExistInArray(arrayToCheck, arrayOfValues) {
        for (let i = 0; i < arrayOfValues.length; i++)
            if (arrayToCheck.indexOf(arrayOfValues[i]) === -1)
                return false;

        return true;
    }

    /**
     * Shuffles and returns an array
     * Courtesy : https://github.com/guilhermepontes
     * Gist : https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
     * @param {Array} arrayToShuffle the array to shuffle
     */
    static ShuffleArray(arrayToShuffle) {
        return arrayToShuffle
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
    }
}