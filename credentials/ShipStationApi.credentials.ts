import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ShipStationApi implements ICredentialType {
	name = 'shipStationApi';
	displayName = 'ShipStation API';
	documentationUrl = 'https://docs.shipstation.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your ShipStation API key. You can generate this in your ShipStation account settings.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.shipstation.com',
			url: '/v2/carriers',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'carriers',
					value: [],
					message: 'Invalid API key or insufficient permissions',
				},
			},
		],
	};
}