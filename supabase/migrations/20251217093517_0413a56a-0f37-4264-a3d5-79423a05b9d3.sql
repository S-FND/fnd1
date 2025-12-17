-- Create test GHG sources for Demo Corporation
INSERT INTO ghg_sources (
  id, portfolio_company_id, source_name, source_type, scope, category, 
  description, activity_unit, measurement_frequency, emission_factor,
  emission_factor_source, reporting_period, created_by, assigned_verifiers
) VALUES 
-- Scope 1 Sources
('a1111111-1111-1111-1111-111111111111', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Diesel Generator - Main Plant', 'Stationary Combustion', 'Scope 1', 'Fuel Combustion',
 'Primary backup power generator', 'liters', 'Monthly', 2.68,
 'EPA', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL),

('a2222222-2222-2222-2222-222222222222', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Company Fleet Vehicles', 'Mobile Combustion', 'Scope 1', 'Transportation',
 'Company owned vehicles for logistics', 'liters', 'Monthly', 2.31,
 'DEFRA', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL),

('a3333333-3333-3333-3333-333333333333', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Natural Gas Boiler', 'Stationary Combustion', 'Scope 1', 'Fuel Combustion',
 'Heating system for manufacturing facility', 'cubic_meters', 'Monthly', 1.89,
 'IPCC', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL),

-- Scope 2 Sources
('b1111111-1111-1111-1111-111111111111', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Grid Electricity - HQ', 'Purchased Electricity', 'Scope 2', 'Electricity',
 'Main headquarters electricity consumption', 'kWh', 'Monthly', 0.82,
 'CEA', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL),

('b2222222-2222-2222-2222-222222222222', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Grid Electricity - Warehouse', 'Purchased Electricity', 'Scope 2', 'Electricity',
 'Warehouse facility electricity', 'kWh', 'Monthly', 0.82,
 'CEA', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL),

-- Scope 3 Sources
('c1111111-1111-1111-1111-111111111111', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Employee Commuting', 'Category 7', 'Scope 3', 'Employee Commuting',
 'Daily employee travel to office', 'km', 'Quarterly', 0.21,
 'DEFRA', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL),

('c2222222-2222-2222-2222-222222222222', '506523cf-70d0-4f4f-8741-23137dbe2770',
 'Business Travel - Air', 'Category 6', 'Scope 3', 'Business Travel',
 'Domestic and international flights', 'passenger_km', 'Quarterly', 0.255,
 'ICAO', 'FY 2024-25', '00000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (id) DO NOTHING;

-- Create test activity data with various statuses
INSERT INTO ghg_activity_data (
  id, source_id, portfolio_company_id, reporting_period, period_name,
  activity_value, activity_unit, emission_factor, calculated_emissions,
  status, created_by, notes
) VALUES
-- Diesel Generator data (submitted for review)
('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Apr 2024',
 450, 'liters', 2.68, 1206, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Monthly diesel consumption for backup generator'),

('d1111112-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'May 2024',
 380, 'liters', 2.68, 1018.4, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Lower usage due to fewer power outages'),

-- Fleet Vehicles data (submitted)
('d2222221-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Apr 2024',
 2800, 'liters', 2.31, 6468, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Fleet fuel consumption - 12 vehicles'),

('d2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'May 2024',
 3100, 'liters', 2.31, 7161, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Higher mileage due to new delivery routes'),

-- Natural Gas data (pending)
('d3333331-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Apr 2024',
 1200, 'cubic_meters', 1.89, 2268, 'pending', '00000000-0000-0000-0000-000000000001', 
 'Draft - awaiting meter verification'),

-- Electricity HQ (submitted)
('d4444441-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Apr 2024',
 45000, 'kWh', 0.82, 36900, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'HQ electricity - includes AC and server room'),

('d4444442-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'May 2024',
 52000, 'kWh', 0.82, 42640, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Higher AC usage due to summer'),

-- Electricity Warehouse (submitted)
('d5555551-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Apr 2024',
 28000, 'kWh', 0.82, 22960, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Warehouse lighting and equipment'),

-- Employee Commuting (submitted)
('d6666661-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Q1 2024',
 125000, 'km', 0.21, 26250, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Employee commuting survey data - 150 employees'),

-- Business Travel (submitted)
('d7777771-7777-7777-7777-777777777777', 'c2222222-2222-2222-2222-222222222222', 
 '506523cf-70d0-4f4f-8741-23137dbe2770', 'FY 2024-25', 'Q1 2024',
 85000, 'passenger_km', 0.255, 21675, 'submitted', '00000000-0000-0000-0000-000000000001', 
 'Business flights - 15 trips domestic, 3 international')
ON CONFLICT (id) DO NOTHING;