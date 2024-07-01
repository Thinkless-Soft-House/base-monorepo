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
}
