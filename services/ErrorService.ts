import { NodeOperationError } from 'n8n-workflow';

export interface ShipStationError {
	message: string;
	code?: string;
	details?: any;
}

export class ErrorService {
	static handleApiError(error: any, context: any, itemIndex?: number): NodeOperationError {
		let message: string;
		let description: string | undefined;

		if (typeof error === 'string') {
			message = error;
		} else if (error.message) {
			message = error.message;
			description = error.details ? JSON.stringify(error.details) : undefined;
		} else if (error.error) {
			message = error.error;
		} else {
			message = 'Unknown error occurred';
		}

		const nodeError = new NodeOperationError(context.getNode(), message, {
			itemIndex,
			description,
		});

		return nodeError;
	}

	static mapHttpStatusToMessage(statusCode: number): string {
		switch (statusCode) {
			case 400:
				return 'Bad Request: Invalid request parameters';
			case 401:
				return 'Unauthorized: Invalid API key or insufficient permissions';
			case 403:
				return 'Forbidden: Access denied';
			case 404:
				return 'Not Found: Resource not found';
			case 422:
				return 'Unprocessable Entity: Validation failed';
			case 429:
				return 'Too Many Requests: Rate limit exceeded';
			case 500:
				return 'Internal Server Error: ShipStation server error';
			case 503:
				return 'Service Unavailable: ShipStation service temporarily unavailable';
			default:
				return `HTTP ${statusCode}: Request failed`;
		}
	}

	static createValidationError(field: string, value: any, expectedType: string): string {
		return `Invalid ${field}: expected ${expectedType}, got ${typeof value}`;
	}
}