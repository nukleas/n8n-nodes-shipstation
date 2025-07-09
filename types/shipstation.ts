// Common types used across ShipStation API
export interface Address {
	name?: string;
	company?: string;
	street1?: string;
	street2?: string;
	street3?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country?: string;
	phone?: string;
	email?: string;
}

export interface Money {
	amount: number;
	currency: string;
}

export interface Package {
	weight?: {
		value: number;
		unit: string;
	};
	dimensions?: {
		length: number;
		width: number;
		height: number;
		unit: string;
	};
}

export interface PaginationLinks {
	first?: { href: string };
	last?: { href: string };
	next?: { href: string };
	prev?: { href: string };
}

export interface PaginatedApiResponse<T> {
	data?: T[];
	total?: number;
	page?: number;
	pages?: number;
	links?: PaginationLinks;
}

// Shipment types
export interface Shipment {
	shipment_id?: string;
	external_shipment_id?: string;
	ship_from?: Address;
	ship_to?: Address;
	return_to?: Address;
	packages?: Package[];
	shipment_status?: 'pending' | 'cancelled' | 'shipped' | 'delivered' | 'exception';
	created_at?: string;
	modified_at?: string;
	ship_date?: string;
	carrier_id?: string;
	service_id?: string;
	tracking_number?: string;
	batch_id?: string;
	tags?: string[];
	total_weight?: {
		value: number;
		unit: string;
	};
	insurance?: {
		insured_value: Money;
		insure_shipment: boolean;
	};
	advanced_options?: {
		bill_to_party?: string;
		bill_to_account?: string;
		bill_to_postal_code?: string;
		bill_to_country_code?: string;
	};
}

export interface ShipmentResponse extends PaginatedApiResponse<Shipment> {
	shipments?: Shipment[];
}

// Label types
export interface Label {
	label_id?: string;
	shipment_id?: string;
	tracking_number?: string;
	status?: 'pending' | 'completed' | 'error' | 'cancelled';
	created_at?: string;
	voided_at?: string;
	carrier_id?: string;
	service_id?: string;
	label_format?: 'pdf' | 'png' | 'zpl';
	label_size?: string;
	label_download?: {
		pdf?: string;
		png?: string;
		zpl?: string;
	};
	tracking_status?: string;
	cost?: Money;
}

export interface LabelResponse extends PaginatedApiResponse<Label> {
	labels?: Label[];
}

// Inventory types
export interface InventoryLevel {
	sku?: string;
	on_hand?: number;
	allocated?: number;
	available?: number;
	average_cost?: Money;
	inventory_warehouse_id?: string;
	inventory_location_id?: string;
}

export interface InventoryResponse extends PaginatedApiResponse<InventoryLevel> {
	inventory?: InventoryLevel[];
}

// Product types
export interface Product {
	product_id?: string;
	sku?: string;
	name?: string;
	description?: string;
	price?: Money;
	weight?: {
		value: number;
		unit: string;
	};
	dimensions?: {
		length: number;
		width: number;
		height: number;
		unit: string;
	};
	created_at?: string;
	modified_at?: string;
	active?: boolean;
	product_category?: string;
	product_type?: string;
	warehouse_location?: string;
	customs_description?: string;
	customs_value?: Money;
	customs_country_of_origin?: string;
	customs_harmonized_tariff_code?: string;
}

export interface ProductResponse extends PaginatedApiResponse<Product> {
	products?: Product[];
}

// Carrier types
export interface Carrier {
	carrier_id?: string;
	name?: string;
	friendly_name?: string;
	account_number?: string;
	requires_funded_account?: boolean;
	balance?: Money;
	nickname?: string;
	shipping_provider_id?: string;
	has_multi_package_supporting_services?: boolean;
	supports_label_messages?: boolean;
	services?: CarrierService[];
	packages?: CarrierPackage[];
	options?: CarrierOption[];
}

export interface CarrierService {
	service_id?: string;
	name?: string;
	code?: string;
	international?: boolean;
	multi_package?: boolean;
	dimensions_required?: boolean;
}

export interface CarrierPackage {
	package_id?: string;
	name?: string;
	code?: string;
	dimensions?: {
		length: number;
		width: number;
		height: number;
		unit: string;
	};
}

export interface CarrierOption {
	option_id?: string;
	name?: string;
	code?: string;
	description?: string;
}

export interface CarrierResponse extends PaginatedApiResponse<Carrier> {
	carriers?: Carrier[];
}

// Rate types
export interface Rate {
	rate_id?: string;
	carrier_id?: string;
	service_id?: string;
	package_id?: string;
	rate_type?: string;
	estimated_delivery_date?: string;
	delivery_days?: number;
	rate_details?: {
		currency_code?: string;
		total_charges?: number;
		base_service_charge?: number;
		carrier_fuel_surcharge?: number;
		carrier_insurance_charge?: number;
		carrier_base_charge?: number;
		carrier_misc_charge?: number;
		carrier_other_charge?: number;
	};
	error_messages?: string[];
}

export interface RateResponse {
	rates?: Rate[];
	invalid_addresses?: Address[];
	rate_request_id?: string;
	shipment_id?: string;
	created_at?: string;
	status?: string;
	errors?: string[];
}

// Batch types
export interface Batch {
	batch_id?: string;
	external_batch_id?: string;
	batch_status?: 'open' | 'queued' | 'completed' | 'completed_with_errors' | 'archived' | 'cancelled';
	created_at?: string;
	processed_at?: string;
	errors_url?: string;
	labels_url?: string;
	forms_url?: string;
	label_count?: number;
	shipment_count?: number;
}

export interface BatchResponse extends PaginatedApiResponse<Batch> {
	batches?: Batch[];
}

// Warehouse types
export interface Warehouse {
	warehouse_id?: string;
	name?: string;
	created_at?: string;
	origin_address?: Address;
	return_address?: Address;
	is_default?: boolean;
}

export interface WarehouseResponse extends PaginatedApiResponse<Warehouse> {
	warehouses?: Warehouse[];
}

// Tag types
export interface Tag {
	tag_id?: string;
	name?: string;
	color?: string;
	created_at?: string;
	modified_at?: string;
}

export interface TagResponse extends PaginatedApiResponse<Tag> {
	tags?: Tag[];
}