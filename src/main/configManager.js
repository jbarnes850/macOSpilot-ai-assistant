const Store = require('electron-store');
const store = new Store();

/**
 * Retrieves the API key from the store.
 * @returns {string} The stored API key or an empty string if not set.
 */
function getApiKey() {
  return store.get('userApiKey', '');
}

/**
 * Saves the API key to the store.
 * @param {string} apiKey The API key to save.
 */
function setApiKey(apiKey) {
  store.set('userApiKey', apiKey);
}

/**
 * Retrieves a generic setting from the store.
 * @param {string} key The key of the setting to retrieve.
 * @param {any} defaultValue The default value to return if the setting is not found.
 * @returns {any} The value of the setting or the default value if not set.
 */
function getSetting(key, defaultValue = null) {
  return store.get(key, defaultValue);
}

/**
 * Saves a generic setting to the store.
 * @param {string} key The key of the setting.
 * @param {any} value The value to save.
 */
function setSetting(key, value) {
  store.set(key, value);
}

/**
 * Clears all settings from the store.
 */
function clearSettings() {
  store.clear();
}

module.exports = {
  getApiKey,
  setApiKey,
  getSetting,
  setSetting,
  clearSettings
};