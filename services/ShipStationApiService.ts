import { ICredentialDataDecryptedObject } from 'n8n-workflow';

export interface ShipStationApiResponse<T> {
	data?: T;
	error?: string;
	statusCode: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pages: number;
	links: {
		first?: { href: string };
		last?: { href: string };
	};
}

export class ShipStationApiService {
	private readonly baseUrl = 'https://api.shipstation.com';

	constructor(private credentials: ICredentialDataDecryptedObject) {}

	async makeRequest<T>(
		endpoint: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
		data?: any,
		additionalHeaders?: Record<string, string>
	): Promise<ShipStationApiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;
		
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'api-key': this.credentials.apiKey as string,
			...additionalHeaders,
		};

		const config: RequestInit = {
			method,
			headers,
		};

		if (data && (method === 'POST' || method === 'PUT')) {
			config.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(url, config);
			const responseData = await response.json() as any;

			if (!response.ok) {
				if (responseData.message && responseData.message.includes('upgrade your billing plan')) {
					return {
						error: 'Your ShipStation plan does not support this feature. Please upgrade your plan to use this endpoint.',
						statusCode: response.status,
					};
				}
				return {
					error: responseData.message || `HTTP ${response.status}: ${response.statusText}`,
					statusCode: response.status,
				};
			}

			return {
				data: responseData as T,
				statusCode: response.status,
			};
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Unknown error occurred',
				statusCode: 0,
			};
		}
	}

	async get<T>(endpoint: string, params?: Record<string, any>): Promise<ShipStationApiResponse<T>> {
		const searchParams = new URLSearchParams();
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value));
				}
			});
		}

		const queryString = searchParams.toString();
		const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
		
		return this.makeRequest<T>(fullEndpoint, 'GET');
	}

	async post<T>(endpoint: string, data: any): Promise<ShipStationApiResponse<T>> {
		return this.makeRequest<T>(endpoint, 'POST', data);
	}

	async put<T>(endpoint: string, data: any): Promise<ShipStationApiResponse<T>> {
		return this.makeRequest<T>(endpoint, 'PUT', data);
	}

	async delete<T>(endpoint: string): Promise<ShipStationApiResponse<T>> {
		return this.makeRequest<T>(endpoint, 'DELETE');
	}
}