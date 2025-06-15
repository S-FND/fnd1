
// This file is maintained for backward compatibility
// It re-exports all the utility functions from the new modular structure

import {
  calculateEmissions,
  sumCategoryEmissions,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  ensureMonthExists,
  getPrePopulatedData
} from './utils';

export {
  calculateEmissions,
  sumCategoryEmissions,
  calculateMonthlyTotal,
  calculateYearlyTotal,
  ensureMonthExists,
  getPrePopulatedData
};
