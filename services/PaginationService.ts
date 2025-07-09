export interface PaginationOptions {
	page?: number;
	pageSize?: number;
	limit?: number;
}

export interface PaginationResult {
	page: number;
	pageSize: number;
	limit?: number;
}

export class PaginationService {
	static readonly DEFAULT_PAGE_SIZE = 50;
	static readonly MAX_PAGE_SIZE = 500;

	static normalizePaginationOptions(options: PaginationOptions = {}): PaginationResult {
		const page = Math.max(1, options.page || 1);
		let pageSize = options.pageSize || this.DEFAULT_PAGE_SIZE;
		
		if (options.limit) {
			pageSize = Math.min(options.limit, pageSize);
		}
		
		pageSize = Math.min(pageSize, this.MAX_PAGE_SIZE);
		pageSize = Math.max(1, pageSize);

		return {
			page,
			pageSize,
			...(options.limit && { limit: options.limit }),
		};
	}

	static buildPaginationParams(options: PaginationOptions, resource?: string): Record<string, any> {
		const normalized = this.normalizePaginationOptions(options);
		
		// Handle resources that only support limit parameter
		if (resource === 'inventory') {
			return {
				limit: normalized.pageSize,
			};
		}
		
		// Standard pagination for most resources
		const params: Record<string, any> = {
			page: normalized.page,
		};

		if (normalized.pageSize !== this.DEFAULT_PAGE_SIZE) {
			params.page_size = normalized.pageSize;
		}

		if (normalized.limit) {
			params.limit = normalized.limit;
		}

		return params;
	}

	static calculateTotalPages(total: number, pageSize: number): number {
		return Math.ceil(total / pageSize);
	}

	static hasNextPage(currentPage: number, totalPages: number): boolean {
		return currentPage < totalPages;
	}

	static hasPreviousPage(currentPage: number): boolean {
		return currentPage > 1;
	}
}