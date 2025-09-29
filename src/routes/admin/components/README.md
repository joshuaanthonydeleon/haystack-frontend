# Admin Components

This directory contains reusable components for the admin dashboard functionality.

## Components

### OverviewTab
Displays key metrics, top categories, recent activity, and quick actions for the admin dashboard overview.

**Props:**
- `metrics: AdminMetrics | null` - Admin metrics data
- `onTabChange: (tabId: string) => void` - Callback to switch tabs

### VendorsTab
Manages vendor listing with filtering capabilities and vendor management actions.

**Props:**
- `vendors: Vendor[]` - Filtered list of vendors to display
- `vendorFilters: { status: 'all' | VendorStatus; category: 'all' | VendorCategory }` - Current filter state
- `setVendorFilters: React.Dispatch<React.SetStateAction<...>>` - Filter state setter
- `categoryOptions: string[]` - Available category options for filtering
- `vendorError: string | null` - Error message to display

### VerificationRequestsTab
Displays pending verification requests with pagination functionality.

**Props:**
- `pendingVerifications: Vendor[]` - List of pending verification requests

**Features:**
- Pagination with configurable page sizes (10, 15, 30, 50)
- Smart page number display with ellipsis
- Results counter

### AnalyticsTab
Shows performance analytics including platform growth and top performers.

**Props:**
- `performanceData: VendorPerformanceMetrics[]` - Performance metrics data

### ActivityTab
Displays recent system activity with filtering options.

**Props:**
- `metrics: AdminMetrics | null` - Admin metrics data containing recent activity

## Usage

```tsx
import {
  OverviewTab,
  VendorsTab,
  VerificationRequestsTab,
  AnalyticsTab,
  ActivityTab,
} from '../../components/admin'
```

## Benefits

- **Separation of Concerns**: Each tab is now a separate, focused component
- **Reusability**: Components can be reused in other parts of the application
- **Maintainability**: Easier to maintain and update individual tab functionality
- **Testability**: Each component can be tested independently
- **Performance**: Smaller bundle sizes and better code splitting potential
