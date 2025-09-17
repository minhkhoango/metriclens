import { writable } from "svelte/store";

// Svelte stores to manage application state will be defined here.

// Example store for results, to be expanded later.
export const results = writable({
  totalROI: 0,
  hoursRecaptured: 0,
  interventionsAvoided: 0,
});
