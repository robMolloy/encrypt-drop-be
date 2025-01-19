const data = process.argv[2];

/**
 * @param {string|undefined} message - The message to log, or undefined if no message is provided.
 * @returns {void}
 */
const init = (str) => {
  try {
    const json = str.replace(/\n| /g, "");
    const obj = JSON.parse(json);

    const functions = obj.functions ?? [];
    const functionNames = functions.map((f) => f.id);
    const functionNamesCommaSeparated = functionNames.join(",");

    console.log(`script.js:${/*LL*/ 12}`, { obj, functionNamesCommaSeparated });
  } catch (error) {
    console.log(`script.js:${/*LL*/ 14}`, { error });
  }
};
init(data);
