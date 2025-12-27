# Scope 1 GHG Accounting - Complete Workflow Guide

## Overview
The Scope 1 GHG Accounting has been completely refactored to implement a 2-step data collection process with comprehensive status tracking and emission factor database integration.

## Key Features

### 1. **2-Step Data Collection Process**
   - **Step 1: Define Emission Source** - Create source templates that define what will be measured
   - **Step 2: Collect Data** - Enter actual activity data against defined sources

### 2. **Status Workflow**
   - **Draft** - Data saved but not submitted
   - **Under Review** - Data submitted and awaiting approval
   - **Reviewed** - Data approved and finalized

### 3. **Emission Factor Database**
   - 80+ emission factors from reputable sources:
     - IPCC 2006
     - DEFRA 2024
     - EPA eGRID
     - CEA India Baseline 2023
     - ICAO 2023
   - Searchable dropdown for easy selection
   - Auto-populated with source, year, and GHG gases included

### 4. **Time-Filtered Dashboards**
   - Monthly view - See data for specific month
   - Yearly view - See aggregated data for entire year
   - Category-wise breakdown with pie charts and bar graphs
   - Monthly trend analysis (yearly view only)

## User Workflow

### Step 1: Define Emission Sources

1. Navigate to **GHG Accounting → Scope 1**
2. Click **"Define New Source"**
3. Fill in source details:
   - **Basic Info**: Source name, facility, business unit, source type
   - **Emission Factor**: Search and select from database
   - **Measurement Parameters**: Activity unit, frequency (Daily/Weekly/Monthly/Quarterly/Annually)
   - **Assignment**: Select data collectors and verifiers
4. Click **"Save Source Definition"**

**Key Points:**
- Source definition can be edited later
- Changes to source definition do NOT affect already collected data
- Frequency determines how many data points are needed per month

### Step 2: Collect Data

1. From Scope 1 main page, click on any source row OR click **"Collect Data"** button
2. Select reporting period (month/year)
3. Enter activity data:
   - Number of entries depends on measurement frequency
   - Each entry includes: date, activity value, notes
   - Emissions calculated automatically
4. Set data quality and verifier
5. Choose action:
   - **Save as Draft** - Keep working on it
   - **Submit for Review** - Send for approval

**Key Points:**
- Data collection form shows expected number of entries based on frequency
- Can add more entries if needed
- Real-time emission calculations shown
- Only collected data can be edited here, NOT source definition

### Step 3: Review Status

**Status Tracking:**
- Sources show status badges for selected time period
- Color-coded: Gray (No Data), Yellow (Draft), Blue (Under Review), Green (Reviewed)
- Click source row to collect data or view existing entries

### Step 4: View Dashboard

1. Click **"View Dashboard"** from Scope 1 main page
2. Select view mode: Monthly or Yearly
3. Choose time period
4. View:
   - Total emissions by category
   - Pie chart distribution
   - Category comparison bar chart
   - Monthly trend (yearly view only)

## Navigation Structure

```
/ghg-accounting
  └── Scope 1 Tab
      ├── Main Page (Scope1NewWorkflow)
      │   ├── Source Templates Table
      │   ├── Category Summary Cards
      │   └── Time Period Filter
      │
      ├── /define-source (SourceTemplateForm)
      │   └── Step 1: Define emission source
      │
      ├── /collect-data (DataCollectionForm)
      │   └── Step 2: Enter activity data
      │
      └── Dashboard (Scope1Dashboard)
          └── Time-filtered category analysis
```

## Data Storage Structure

### Source Templates
```javascript
localStorage: 'scope1_source_templates'
- Contains all defined emission sources
- Independent of time periods
- Can be edited without affecting collected data
```

### Data Collections
```javascript
localStorage: 'scope1_data_collections_{templateId}_{month}_{year}'
- Contains actual measurements
- Linked to source template via templateId
- Time-period specific
- Includes calculated emissions
```

### Status Tracking
```javascript
localStorage: 'scope1_status_{templateId}_{month}_{year}'
- Values: 'Draft', 'Under Review', 'Reviewed'
- Time-period and source-specific
```

## Frequency-Based Data Collection

| Frequency | Monthly Data Points | Example |
|-----------|---------------------|---------|
| Daily | 30 entries | Each day's fuel consumption |
| Weekly | 4 entries | Each week's refrigerant leakage |
| Monthly | 1 entry | Monthly generator usage |
| Quarterly | 0 or 1 (specific months) | Quarterly HVAC maintenance |
| Annually | 0 or 1 (March only) | Annual process emissions |

## Editing Rules

### Source Definition (Step 1)
- **Can Edit**: All source parameters, emission factors, assignments
- **Cannot Edit Through Here**: Collected data
- **Access**: Click "Edit" icon button on source row

### Collected Data (Step 2)
- **Can Edit**: Activity values, dates, notes, quality, verifier
- **Cannot Edit Through Here**: Source definition, emission factors
- **Access**: Click on source row or "Collect Data" button

## Status Transitions

```
No Data → Draft → Under Review → Reviewed
           ↑         ↑
           └─────────┘
        (Can revert to Draft by saving)
```

## Benefits of New Architecture

1. **Separation of Concerns**: Source definition separated from data collection
2. **Flexibility**: Add/modify sources without affecting historical data
3. **Traceability**: Clear status tracking throughout approval process
4. **Standardization**: Emission factors from verified databases
5. **Efficiency**: Frequency-based collection reduces data entry burden
6. **Transparency**: Clear workflow from definition → collection → review

## Next Steps

This pattern will be replicated for:
- **Scope 2**: Indirect emissions from purchased energy
- **Scope 3**: Value chain emissions (15 categories)
- **Scope 4**: Avoided emissions

All scopes will follow the same 2-step process with appropriate emission factors and categories.