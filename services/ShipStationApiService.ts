import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

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

	constructor(private context: IExecuteFunctions) {}

	async makeRequest<T>(
		endpoint: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
		data?: any,
		additionalHeaders?: Record<string, string>
	): Promise<ShipStationApiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;
		
		const options: IHttpRequestOptions = {
			method,
			url,
			headers: {
				'Content-Type': 'application/json',
				...additionalHeaders,
			},
			json: true,
		};

		if (data && (method === 'POST' || method === 'PUT')) {
			options.body = data;
		}

		try {
			const responseData = await this.context.helpers.requestWithAuthentication.call(
				this.context,
				'shipStationApi',
				options,
			);

			return {
				data: responseData as T,
				statusCode: 200,
			};
		} catch (error: any) {
			// Handle specific ShipStation error messages
			if (error.response?.body?.message?.includes('upgrade your billing plan')) {
				return {
					error: 'Your ShipStation plan does not support this feature. Please upgrade your plan to use this endpoint.',
					statusCode: error.response?.statusCode || 400,
				};
			}

			return {
				error: error.response?.body?.message || error.message || 'Unknown error occurred',
				statusCode: error.response?.statusCode || 0,
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