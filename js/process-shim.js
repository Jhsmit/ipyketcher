// Shim to provide Node.js globals in browser environment
import process from 'process/browser';

// Polyfill global object for browser
if (typeof window !== 'undefined') {
  window.process = process;
  window.global = window;
}

export { process };
