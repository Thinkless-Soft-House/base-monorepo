export default class UtilsHandler {
  static jsonValidator(value, helpers) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error();
      }
      return parsed; // Return the parsed value to use it as a real object in the configuration
    } catch (e) {
      return helpers.error('any.invalid');
    }
  }

  static loggingValidator(value, helpers) {
    // Value is a joined array of values separated by commas
    // Possible values are: query, schema, error, warn, info, log, migration
    const values = value.split(',');
    const validValues = [
      'query',
      'schema',
      'error',
      'warn',
      'info',
      'log',
      'migration',
    ];

    // Check if all values are valid
    const isValid = values.every((v) => validValues.includes(v));

    // If not valid, return an error
    if (!isValid) {
      return helpers.error('any.invalid');
    }

    // If valid, return the array of values
    return values;
  }
}
