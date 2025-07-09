# ShipStation API v2 - Split OpenAPI Specification

This directory contains the ShipStation API v2 specification split into resource-specific YAML files for better organization and maintainability.

## Directory Structure

```
openapi-spec/
├── README.md                    # This file
├── inventory/
│   └── inventory.yaml          # Inventory management (levels, warehouses, locations)
├── batches/
│   └── batches.yaml            # Batch operations and processing
├── carriers/
│   └── carriers.yaml           # Carrier information and configurations
├── labels/
│   └── labels.yaml             # Label creation, tracking, and manifests
├── rates/
│   └── rates.yaml              # Rate calculation and estimates
├── shipments/
│   └── shipments.yaml          # Shipment management and lifecycle
├── tags/
│   └── tags.yaml               # Tag management and organization
├── warehouses/
│   └── warehouses.yaml         # Warehouse management
└── products/
    └── products.yaml           # Product and SKU management
```

## Resource Overview

### Inventory (`inventory/inventory.yaml`)
- **Endpoints**: `/v2/inventory`, `/v2/inventory_warehouses`, `/v2/inventory_locations`
- **Operations**: List inventory levels, manage inventory warehouses and locations
- **Key Features**: Inventory tracking, warehouse management, location management

### Batches (`batches/batches.yaml`)
- **Endpoints**: `/v2/batches/*`
- **Operations**: Create, process, and manage batches of shipments
- **Key Features**: Batch processing, label generation, error handling

### Carriers (`carriers/carriers.yaml`)
- **Endpoints**: `/v2/carriers/*`
- **Operations**: List carriers, get carrier details, services, packages, and options
- **Key Features**: Carrier configuration, service options, package types

### Labels (`labels/labels.yaml`)
- **Endpoints**: `/v2/labels/*`, `/v2/manifests/*`
- **Operations**: Create labels, track shipments, void labels, manage manifests
- **Key Features**: Label generation, tracking, return labels, end-of-day processing

### Rates (`rates/rates.yaml`)
- **Endpoints**: `/v2/rates/*`
- **Operations**: Calculate shipping rates, estimate costs, get rate details
- **Key Features**: Rate calculation, cost estimation, service comparison

### Shipments (`shipments/shipments.yaml`)
- **Endpoints**: `/v2/shipments/*`
- **Operations**: Create, update, cancel shipments, manage tags
- **Key Features**: Shipment lifecycle, address management, customs handling

### Tags (`tags/tags.yaml`)
- **Endpoints**: `/v2/tags/*`
- **Operations**: Create, update, delete tags for shipment organization
- **Key Features**: Tag management, categorization, color coding

### Warehouses (`warehouses/warehouses.yaml`)
- **Endpoints**: `/v2/warehouses/*`
- **Operations**: Manage warehouses for shipping operations
- **Key Features**: Warehouse configuration, origin/return addresses

### Products (`products/products.yaml`)
- **Endpoints**: `/v2/products/*`
- **Operations**: Manage products and SKUs for inventory tracking
- **Key Features**: Product catalog, SKU management, inventory integration

## Usage

Each YAML file contains:
- **Header comment**: Describing the resource and its purpose
- **Paths section**: All API endpoints for that resource
- **Components section**: Relevant schemas and data models

### Integration Notes

- All files use consistent schema references where possible
- Common schemas (like `Address`, `BadRequest`, `ServerError`) are duplicated across files for standalone usage
- Each file can be used independently or combined to reconstruct the full API specification
- Response schemas include proper error handling and pagination where applicable

### Common Patterns

1. **Authentication**: All endpoints require API key authentication
2. **Error Handling**: Consistent error response format across all resources
3. **Pagination**: List endpoints support pagination with `page`, `page_size`, and `links` objects
4. **Filtering**: Most list endpoints support filtering by relevant parameters
5. **Timestamps**: All resources include `created_at` and `modified_at` fields

## Development Usage

These split files can be used for:
- Generating resource-specific client libraries
- Creating focused documentation for specific features
- Building modular n8n nodes for each resource
- API testing and validation by resource area
- Microservice development with resource-specific APIs

## Maintenance

When updating the API specification:
1. Update the appropriate resource file(s)
2. Ensure schema consistency across files
3. Update this README if new resources are added
4. Validate each file can be parsed as valid OpenAPI YAML