import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionTypes,
	IDataObject,
} from 'n8n-workflow';

import { ShipStationApiService } from '../../services/ShipStationApiService';
import { ErrorService } from '../../services/ErrorService';
import { PaginationService } from '../../services/PaginationService';

// Helper function to extract items from API response
function extractItemsFromResponse(data: any): any[] {
	if (!data) {
		return [];
	}
	
	if (Array.isArray(data)) {
		return data;
	}

	// Check for known ShipStation response patterns
	const items = 
		data.shipments ||
		data.labels ||
		data.inventory ||
		data.products ||
		data.rates ||
		data.batches ||
		data.carriers ||
		data.warehouses ||
		data.tags;

	if (items) {
		return Array.isArray(items) ? items : [items];
	}

	// If no known patterns match, check for any array property
	const arrayProperty = Object.values(data).find(value => Array.isArray(value));
	if (arrayProperty) {
		return arrayProperty as any[];
	}

	// If data is an object but not an array and no array properties found, wrap it
	if (typeof data === 'object' && !Array.isArray(data)) {
		return [data];
	}

	return [];
}

// Helper function to get correct endpoint for resource
function getResourceEndpoint(resource: string): string {
	const resourceMap: Record<string, string> = {
		shipment: 'shipments',
		label: 'labels',
		inventory: 'inventory',
		product: 'products',
		rate: 'rates',
		batch: 'batches',
		carrier: 'carriers',
		warehouse: 'warehouses',
		tag: 'tags',
	};

	return resourceMap[resource] || `${resource}s`;
}

export class ShipStation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ShipStation',
		name: 'shipStation',
		icon: {
			light: 'file:shipstation.svg',
			dark: 'file:shipstation.dark.svg',
		},
		group: ['transform'],
		version: 1,
		description: 'Interact with ShipStation API v2',
		defaults: {
			name: 'ShipStation',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'shipStationApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Batch',
						value: 'batch',
					},
					{
						name: 'Carrier',
						value: 'carrier',
					},
					{
						name: 'Inventory',
						value: 'inventory',
					},
					{
						name: 'Label',
						value: 'label',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Rate',
						value: 'rate',
					},
					{
						name: 'Shipment',
						value: 'shipment',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
					{
						name: 'Warehouse',
						value: 'warehouse',
					},
				],
				default: 'shipment',
			},

			// Shipment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['shipment'],
					},
				},
				options: [
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a shipment',
						action: 'Cancel a shipment',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a shipment',
						action: 'Create a shipment',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a shipment',
						action: 'Get a shipment',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List shipments',
						action: 'List shipments',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a shipment',
						action: 'Update a shipment',
					},
				],
				default: 'list',
			},

			// Label Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['label'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a label',
						action: 'Create a label',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a label',
						action: 'Get a label',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List labels',
						action: 'List labels',
					},
					{
						name: 'Void',
						value: 'void',
						description: 'Void a label',
						action: 'Void a label',
					},
				],
				default: 'list',
			},

			// Inventory Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['inventory'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List inventory levels',
						action: 'List inventory levels',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update inventory levels',
						action: 'Update inventory levels',
					},
				],
				default: 'list',
			},

			// Product Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['product'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a product',
						action: 'Create a product',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a product',
						action: 'Delete a product',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a product',
						action: 'Get a product',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List products',
						action: 'List products',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a product',
						action: 'Update a product',
					},
				],
				default: 'list',
			},

			// Rate Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['rate'],
					},
				},
				options: [
					{
						name: 'Calculate',
						value: 'calculate',
						description: 'Calculate shipping rates',
						action: 'Calculate shipping rates',
					},
				],
				default: 'calculate',
			},

			// Batch Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['batch'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a batch',
						action: 'Create a batch',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a batch',
						action: 'Get a batch',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List batches',
						action: 'List batches',
					},
					{
						name: 'Process',
						value: 'process',
						description: 'Process a batch',
						action: 'Process a batch',
					},
				],
				default: 'list',
			},

			// Carrier Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['carrier'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a carrier',
						action: 'Get a carrier',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List carriers',
						action: 'List carriers',
					},
				],
				default: 'list',
			},

			// Warehouse Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['warehouse'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a warehouse',
						action: 'Create a warehouse',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a warehouse',
						action: 'Delete a warehouse',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a warehouse',
						action: 'Get a warehouse',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List warehouses',
						action: 'List warehouses',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a warehouse',
						action: 'Update a warehouse',
					},
				],
				default: 'list',
			},

			// Tag Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tag'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a tag',
						action: 'Create a tag',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a tag',
						action: 'Delete a tag',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a tag',
						action: 'Get a tag',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List tags',
						action: 'List tags',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a tag',
						action: 'Update a tag',
					},
				],
				default: 'list',
			},

			// Common field: ID for get, update, delete operations
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete', 'cancel', 'void', 'process'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the resource',
			},

			// Pagination options for list operations
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number to retrieve',
					},
					{
						displayName: 'Page Size',
						name: 'pageSize',
						type: 'number',
						default: 50,
						description: 'Number of items per page',
					},
					{
						displayName: 'Return All',
						name: 'returnAll',
						type: 'boolean',
						default: false,
						description: 'Whether to return all results or only up to a given limit',
					},
				],
			},

			// JSON input for create/update operations
			{
				displayName: 'JSON Data',
				name: 'jsonData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: '{}',
				description: 'JSON data for the resource',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const apiService = new ShipStationApiService(this);

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData;

				// Handle list operations with pagination
				if (operation === 'list') {
					const options = this.getNodeParameter('options', i, {}) as any;
					const returnAll = options.returnAll || false;
					const endpoint = `/v2/${getResourceEndpoint(resource)}`;

					if (returnAll) {
						// Handle inventory resource differently (no pagination)
						if (resource === 'inventory') {
							const params = PaginationService.buildPaginationParams({ pageSize: 1000 }, resource);
							const response = await apiService.get(endpoint, params);

							if (response.error) {
								throw ErrorService.handleApiError(response.error, this, i);
							}

							if (!response.data) {
								throw new NodeOperationError(this.getNode(), 'No data received from ShipStation API', { itemIndex: i });
							}

							const items = extractItemsFromResponse(response.data);
							responseData = { data: items, statusCode: response.statusCode };
						} else {
							// Standard pagination for other resources
							let allData: any[] = [];
							let page = 1;
							let hasMore = true;

							while (hasMore) {
								const params = PaginationService.buildPaginationParams(
									{ page, pageSize: 500 },
									resource,
								);
								const response = await apiService.get(endpoint, params);

								if (response.error) {
									throw ErrorService.handleApiError(response.error, this, i);
								}

								if (!response.data) {
									throw new NodeOperationError(this.getNode(), 'No data received from ShipStation API', { itemIndex: i });
								}

								const data = response.data as any;
								const items = extractItemsFromResponse(data);
								allData = allData.concat(items);

								// Handle pagination safely
								hasMore = data && typeof data.page === 'number' && typeof data.pages === 'number' && data.page < data.pages;
								page++;
							}

							responseData = { data: allData, statusCode: 200 };
						}
					} else {
						const params = PaginationService.buildPaginationParams(
							{
								page: options.page,
								pageSize: options.pageSize,
							},
							resource,
						);

						const response = await apiService.get(endpoint, params);

						if (response.error) {
							throw ErrorService.handleApiError(response.error, this, i);
						}

						if (!response.data) {
							throw new NodeOperationError(this.getNode(), 'No data received from ShipStation API', { itemIndex: i });
						}

						const items = extractItemsFromResponse(response.data);
						responseData = { data: items, statusCode: response.statusCode };
					}
				}
				// Handle get operations
				else if (operation === 'get') {
					const id = this.getNodeParameter('id', i) as string;
					const endpoint = `/v2/${getResourceEndpoint(resource)}/${id}`;
					responseData = await apiService.get(endpoint);
				}
				// Handle create operations
				else if (operation === 'create') {
					const jsonData = this.getNodeParameter('jsonData', i) as string;
					const endpoint = `/v2/${getResourceEndpoint(resource)}`;
					responseData = await apiService.post(endpoint, JSON.parse(jsonData));
				}
				// Handle update operations
				else if (operation === 'update') {
					const id = this.getNodeParameter('id', i) as string;
					const jsonData = this.getNodeParameter('jsonData', i) as string;
					const endpoint = `/v2/${getResourceEndpoint(resource)}/${id}`;
					responseData = await apiService.put(endpoint, JSON.parse(jsonData));
				}
				// Handle delete operations
				else if (operation === 'delete') {
					const id = this.getNodeParameter('id', i) as string;
					const endpoint = `/v2/${getResourceEndpoint(resource)}/${id}`;
					responseData = await apiService.delete(endpoint);
				}
				// Handle special operations
				else if (operation === 'cancel' && resource === 'shipment') {
					const id = this.getNodeParameter('id', i) as string;
					responseData = await apiService.post(`/v2/shipments/${id}/cancel`, {});
				} else if (operation === 'void' && resource === 'label') {
					const id = this.getNodeParameter('id', i) as string;
					responseData = await apiService.put(`/v2/labels/${id}/void`, {});
				} else if (operation === 'process' && resource === 'batch') {
					const id = this.getNodeParameter('id', i) as string;
					responseData = await apiService.post(`/v2/batches/${id}/process`, {});
				} else if (operation === 'calculate' && resource === 'rate') {
					const jsonData = this.getNodeParameter('jsonData', i) as string;
					responseData = await apiService.post('/v2/rates', JSON.parse(jsonData));
				} else if (operation === 'update' && resource === 'inventory') {
					const jsonData = this.getNodeParameter('jsonData', i) as string;
					responseData = await apiService.post('/v2/inventory', JSON.parse(jsonData));
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
				}

				if (responseData.error) {
					throw ErrorService.handleApiError(responseData.error, this, i);
				}

				// Handle list operations that return arrays differently
				if (operation === 'list' && Array.isArray(responseData.data)) {
					// For list operations, add each item separately with proper pairing
					responseData.data.forEach((item: any) => {
						returnData.push({
							json: item as IDataObject,
							pairedItem: { item: i },
						});
					});
				} else {
					// For single item operations
					returnData.push({ 
						json: responseData.data as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ 
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
