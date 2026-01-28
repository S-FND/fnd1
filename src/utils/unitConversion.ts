// Unit conversion utilities for GHG emission calculations

export interface UnitConversionFactor {
    from: string;
    to: string;
    factor: number;
  }
  
  // Common unit conversions for GHG emissions
  export const UNIT_CONVERSIONS: UnitConversionFactor[] = [
    // Mass conversions
    { from: 'kg', to: 'tonnes', factor: 0.001 },
    { from: 'tonnes', to: 'kg', factor: 1000 },
    { from: 'kg', to: 'g', factor: 1000 },
    { from: 'g', to: 'kg', factor: 0.001 },
    { from: 'g', to: 'tonnes', factor: 0.000001 },
    { from: 'tonnes', to: 'g', factor: 1000000 },
    { from: 'lb', to: 'kg', factor: 0.453592 },
    { from: 'kg', to: 'lb', factor: 2.20462 },
    
    // Volume conversions (liquid)
    { from: 'litres', to: 'm³', factor: 0.001 },
    { from: 'm³', to: 'litres', factor: 1000 },
    { from: 'litres', to: 'gallons', factor: 0.264172 },
    { from: 'gallons', to: 'litres', factor: 3.78541 },
    { from: 'ml', to: 'litres', factor: 0.001 },
    { from: 'litres', to: 'ml', factor: 1000 },
    
    // Energy conversions
    { from: 'kWh', to: 'MWh', factor: 0.001 },
    { from: 'MWh', to: 'kWh', factor: 1000 },
    { from: 'kWh', to: 'GJ', factor: 0.0036 },
    { from: 'GJ', to: 'kWh', factor: 277.778 },
    { from: 'kWh', to: 'MJ', factor: 3.6 },
    { from: 'MJ', to: 'kWh', factor: 0.277778 },
    { from: 'kWh equivalent', to: 'kWh', factor: 1 },
    { from: 'kWh', to: 'kWh equivalent', factor: 1 },
    
    // Distance conversions
    { from: 'km', to: 'miles', factor: 0.621371 },
    { from: 'miles', to: 'km', factor: 1.60934 },
    { from: 'km', to: 'm', factor: 1000 },
    { from: 'm', to: 'km', factor: 0.001 },
    
    // Composite units (distance * weight)
    { from: 'tonne-km', to: 'kg-km', factor: 1000 },
    { from: 'kg-km', to: 'tonne-km', factor: 0.001 },
    { from: 'tonne-mile', to: 'tonne-km', factor: 1.60934 },
    { from: 'tonne-km', to: 'tonne-mile', factor: 0.621371 },
    
    // Passenger distance
    { from: 'passenger-km', to: 'passenger-mile', factor: 0.621371 },
    { from: 'passenger-mile', to: 'passenger-km', factor: 1.60934 },
  ];
  
  /**
   * Convert a value from one unit to another
   * @param value The value to convert
   * @param fromUnit The unit to convert from
   * @param toUnit The unit to convert to
   * @returns The converted value, or null if conversion not found
   */
  export function convertUnit(
    value: number,
    fromUnit: string,
    toUnit: string
  ): number | null {
    // If units are the same, return the value
    if (fromUnit === toUnit) return value;
    
    // Normalize unit strings (remove extra spaces, handle case)
    const normalizedFrom = fromUnit.trim().toLowerCase();
    const normalizedTo = toUnit.trim().toLowerCase();
    
    if (normalizedFrom === normalizedTo) return value;
    
    // Find direct conversion
    const directConversion = UNIT_CONVERSIONS.find(
      c => c.from.toLowerCase() === normalizedFrom && c.to.toLowerCase() === normalizedTo
    );
    
    if (directConversion) {
      return value * directConversion.factor;
    }
    
    // Try reverse conversion
    const reverseConversion = UNIT_CONVERSIONS.find(
      c => c.to.toLowerCase() === normalizedFrom && c.from.toLowerCase() === normalizedTo
    );
    
    if (reverseConversion) {
      return value / reverseConversion.factor;
    }
    
    // Try multi-step conversion (through a common intermediate unit)
    // For example: gallons -> litres -> m³
    for (const intermediate of ['kg', 'litres', 'kWh', 'km', 'm']) {
      const toIntermediate = UNIT_CONVERSIONS.find(
        c => c.from.toLowerCase() === normalizedFrom && c.to.toLowerCase() === intermediate
      );
      const fromIntermediate = UNIT_CONVERSIONS.find(
        c => c.from.toLowerCase() === intermediate && c.to.toLowerCase() === normalizedTo
      );
      
      if (toIntermediate && fromIntermediate) {
        return value * toIntermediate.factor * fromIntermediate.factor;
      }
    }
    
    // No conversion found
    return null;
  }
  
  /**
   * Get available conversion units for a given unit
   * @param unit The base unit
   * @returns Array of units that can be converted to/from
   */
  export function getAvailableConversions(unit: string): string[] {
    const normalizedUnit = unit.trim().toLowerCase();
    const availableUnits = new Set<string>();
    
    // Add the original unit
    availableUnits.add(unit);
    
    // Find direct conversions
    UNIT_CONVERSIONS.forEach(conversion => {
      if (conversion.from.toLowerCase() === normalizedUnit) {
        availableUnits.add(conversion.to);
      }
      if (conversion.to.toLowerCase() === normalizedUnit) {
        availableUnits.add(conversion.from);
      }
    });
    
    return Array.from(availableUnits);
  }
  
  /**
   * Format a unit conversion for display
   * @param value Original value
   * @param fromUnit Original unit
   * @param toUnit Target unit
   * @returns Formatted string showing conversion
   */
  export function formatConversion(
    value: number,
    fromUnit: string,
    toUnit: string
  ): string {
    const converted = convertUnit(value, fromUnit, toUnit);
    
    if (converted === null) {
      return `Cannot convert ${fromUnit} to ${toUnit}`;
    }
    
    if (fromUnit === toUnit) {
      return `${value.toFixed(2)} ${fromUnit}`;
    }
    
    return `${value.toFixed(2)} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`;
  }
  
  /**
   * Validate if a conversion is possible
   * @param fromUnit Source unit
   * @param toUnit Target unit
   * @returns True if conversion is possible
   */
  export function canConvert(fromUnit: string, toUnit: string): boolean {
    return convertUnit(1, fromUnit, toUnit) !== null;
  }