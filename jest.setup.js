// jest.setup.js
import '@testing-library/jest-dom/extend-expect'

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
  }
}))

var localStorageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });