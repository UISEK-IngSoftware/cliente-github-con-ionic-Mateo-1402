// jest-dom: matchers para pruebas DOM
import '@testing-library/jest-dom/extend-expect';

// Simula matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};
