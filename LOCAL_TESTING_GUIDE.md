# Local n8n Testing Guide

## Prerequisites
1. Node.js ≥20.15 installed
2. n8n installed globally: `npm install n8n -g`
3. ShipStation API credentials (API Key)

## Setup Steps

### 1. Link the Package Locally
```bash
# In the n8n-nodes-shipstation directory
npm run build
npm link

# In a separate directory for testing
npm link n8n-nodes-shipstation
```

### 2. Start n8n in Development Mode
```bash
# Set environment variables for development
export N8N_CUSTOM_EXTENSIONS=n8n-nodes-shipstation
export N8N_NODES_EXCLUDE=""

# Start n8n
n8n start
```

### 3. Access n8n Interface
1. Open browser to `http://localhost:5678`
2. Create a workflow
3. Look for "ShipStation" in the node list

### 4. Test Credentials
1. Add ShipStation node to workflow
2. Create new credential
3. Enter your ShipStation API key
4. Test connection

### 5. Test Basic Operations
1. **List Shipments**: Test pagination and "Return All" functionality
2. **Get Shipment**: Test with a valid shipment ID
3. **Create Shipment**: Test with valid shipment data
4. **Error Handling**: Test with invalid data/credentials

## Troubleshooting

### Node Not Appearing
- Verify package is linked: `npm list -g n8n-nodes-shipstation`
- Check n8n logs for loading errors
- Ensure build was successful: `npm run build`

### Credential Issues
- Verify API key is correct
- Check ShipStation API documentation for authentication
- Test API directly with curl/Postman first

### Import Issues
- Ensure all service files are properly built in dist/
- Check TypeScript compilation errors
- Verify all imports are using correct paths

## Next Steps After Local Testing
1. Test all resource operations
2. Verify error handling
3. Test edge cases and validation
4. Performance testing with large datasets
5. Ready for production deployment