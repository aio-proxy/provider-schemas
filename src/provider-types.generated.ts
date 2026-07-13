// biome-ignore-all format: This file is deterministically generated.



interface P0AlibabaProviderSettings {
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers or regional endpoints.
     * The default prefix is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers or regional endpoints.
     * The default prefix is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`.
     */
    baseURL?: string;
    /**
     * Use a different URL prefix for video generation API calls.
     * The video API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).
     * The default prefix is `https://dashscope-intl.aliyuncs.com`.
     * @description Use a different URL prefix for video generation API calls.
     * The video API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).
     * The default prefix is `https://dashscope-intl.aliyuncs.com`.
     */
    videoBaseURL?: string;
    /**
     * Use a different URL prefix for embedding API calls.
     * The embedding API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).
     * The default prefix is `https://dashscope-intl.aliyuncs.com/api/v1`.
     * @description Use a different URL prefix for embedding API calls.
     * The embedding API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).
     * The default prefix is `https://dashscope-intl.aliyuncs.com/api/v1`.
     */
    embeddingBaseURL?: string;
    /**
     * API key that is being sent using the `Authorization` header.
     * It defaults to the `ALIBABA_API_KEY` environment variable.
     * @description API key that is being sent using the `Authorization` header.
     * It defaults to the `ALIBABA_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Include usage information in streaming responses.
     * When enabled, token usage will be included in the final chunk.
     *
     * @default true
     * @description Include usage information in streaming responses.
     * When enabled, token usage will be included in the final chunk.
     */
    includeUsage?: boolean;
}

export type P0ProviderOptions = P0AlibabaProviderSettings;

interface P1AmazonBedrockProviderSettings {
    /**
     * The AWS region to use for the Bedrock provider. Defaults to the value of the
     * `AWS_REGION` environment variable.
     * @description The AWS region to use for the Bedrock provider. Defaults to the value of the
     * `AWS_REGION` environment variable.
     */
    region?: string;
    /**
     * API key for authenticating requests using Bearer token authentication.
     * When provided, this will be used instead of AWS SigV4 authentication.
     * Defaults to the value of the `AWS_BEARER_TOKEN_BEDROCK` environment variable.
     *
     * @example
     * ```typescript
     * // Using API key directly
     * const bedrock = createAmazonBedrock({
     * apiKey: 'your-api-key-here',
     * region: 'us-east-1'
     * });
     *
     * // Using environment variable AWS_BEARER_TOKEN_BEDROCK
     * const bedrock = createAmazonBedrock({
     * region: 'us-east-1'
     * });
     * ```
     *
     * Note: When `apiKey` is provided, it takes precedence over AWS SigV4 authentication.
     * If neither `apiKey` nor `AWS_BEARER_TOKEN_BEDROCK` environment variable is set,
     * the provider will fall back to AWS SigV4 authentication using AWS credentials.
     * @description API key for authenticating requests using Bearer token authentication.
     * When provided, this will be used instead of AWS SigV4 authentication.
     * Defaults to the value of the `AWS_BEARER_TOKEN_BEDROCK` environment variable.
     */
    apiKey?: string;
    /**
     * The AWS access key ID to use for the Bedrock provider. Defaults to the value of the
     * `AWS_ACCESS_KEY_ID` environment variable.
     * @description The AWS access key ID to use for the Bedrock provider. Defaults to the value of the
     * `AWS_ACCESS_KEY_ID` environment variable.
     */
    accessKeyId?: string;
    /**
     * The AWS secret access key to use for the Bedrock provider. Defaults to the value of the
     * `AWS_SECRET_ACCESS_KEY` environment variable.
     * @description The AWS secret access key to use for the Bedrock provider. Defaults to the value of the
     * `AWS_SECRET_ACCESS_KEY` environment variable.
     */
    secretAccessKey?: string;
    /**
     * The AWS session token to use for the Bedrock provider. When `accessKeyId` and
     * `secretAccessKey` are both passed explicitly as options, only this field is used
     * If either access key field is omitted and resolved from the environment, the
     * session token also falls back to `AWS_SESSION_TOKEN` when not set here.
     * @description The AWS session token to use for the Bedrock provider. When `accessKeyId` and
     * `secretAccessKey` are both passed explicitly as options, only this field is used
     * If either access key field is omitted and resolved from the environment, the
     * session token also falls back to `AWS_SESSION_TOKEN` when not set here.
     */
    sessionToken?: string;
    /**
     * Base URL for the Bedrock API calls.
     * @description Base URL for the Bedrock API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * The AWS credential provider to use for the Bedrock provider to get dynamic
     * credentials similar to the AWS SDK. Setting a provider here will cause its
     * credential values to be used instead of the `accessKeyId`, `secretAccessKey`,
     * and `sessionToken` settings.
     * @description The AWS credential provider to use for the Bedrock provider to get dynamic
     * credentials similar to the AWS SDK. Setting a provider here will cause its
     * credential values to be used instead of the `accessKeyId`, `secretAccessKey`,
     * and `sessionToken` settings.
     */
    credentialProvider?: unknown;
    generateId?: unknown;
}

export type P1ProviderOptions = P1AmazonBedrockProviderSettings;

interface P2AnthropicProviderSettings {
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.anthropic.com/v1`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.anthropic.com/v1`.
     */
    baseURL?: string;
    /**
     * API key that is being send using the `x-api-key` header.
     * It defaults to the `ANTHROPIC_API_KEY` environment variable.
     * Only one of `apiKey` or `authToken` is required.
     * @description API key that is being send using the `x-api-key` header.
     * It defaults to the `ANTHROPIC_API_KEY` environment variable.
     * Only one of `apiKey` or `authToken` is required.
     */
    apiKey?: string;
    /**
     * Auth token that is being sent using the `Authorization: Bearer` header.
     * It defaults to the `ANTHROPIC_AUTH_TOKEN` environment variable.
     * Only one of `apiKey` or `authToken` is required.
     * @description Auth token that is being sent using the `Authorization: Bearer` header.
     * It defaults to the `ANTHROPIC_AUTH_TOKEN` environment variable.
     * Only one of `apiKey` or `authToken` is required.
     */
    authToken?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    generateId?: unknown;
    /**
     * Custom provider name
     * Defaults to 'anthropic.messages'.
     * @description Custom provider name
     * Defaults to 'anthropic.messages'.
     */
    name?: string;
}

export type P2ProviderOptions = P2AnthropicProviderSettings;

interface P3AnthropicAwsProviderSettings {
    /**
     * The AWS region to use for Claude Platform on AWS. Defaults to the value of the
     * `AWS_REGION` environment variable. Required — there is no fallback default.
     * @description The AWS region to use for Claude Platform on AWS. Defaults to the value of the
     * `AWS_REGION` environment variable. Required — there is no fallback default.
     */
    region?: string;
    /**
     * The Anthropic workspace ID for this AWS account. Sent on every request via the
     * `anthropic-workspace-id` header. Defaults to the value of the
     * `ANTHROPIC_AWS_WORKSPACE_ID` environment variable.
     * @description The Anthropic workspace ID for this AWS account. Sent on every request via the
     * `anthropic-workspace-id` header. Defaults to the value of the
     * `ANTHROPIC_AWS_WORKSPACE_ID` environment variable.
     */
    workspaceId?: string;
    /**
     * API key for authenticating requests via the `x-api-key` header.
     * When provided, this will be used instead of AWS SigV4 authentication.
     * Defaults to the value of the `ANTHROPIC_AWS_API_KEY` environment variable.
     * @description API key for authenticating requests via the `x-api-key` header.
     * When provided, this will be used instead of AWS SigV4 authentication.
     * Defaults to the value of the `ANTHROPIC_AWS_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * The AWS access key ID to use for SigV4 authentication. Defaults to the value of the
     * `AWS_ACCESS_KEY_ID` environment variable.
     * @description The AWS access key ID to use for SigV4 authentication. Defaults to the value of the
     * `AWS_ACCESS_KEY_ID` environment variable.
     */
    accessKeyId?: string;
    /**
     * The AWS secret access key to use for SigV4 authentication. Defaults to the value of the
     * `AWS_SECRET_ACCESS_KEY` environment variable.
     * @description The AWS secret access key to use for SigV4 authentication. Defaults to the value of the
     * `AWS_SECRET_ACCESS_KEY` environment variable.
     */
    secretAccessKey?: string;
    /**
     * The AWS session token to use for SigV4 authentication. Defaults to the value of the
     * `AWS_SESSION_TOKEN` environment variable.
     * @description The AWS session token to use for SigV4 authentication. Defaults to the value of the
     * `AWS_SESSION_TOKEN` environment variable.
     */
    sessionToken?: string;
    /**
     * Base URL for the Claude Platform on AWS API calls.
     * @description Base URL for the Claude Platform on AWS API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string | undefined>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * The AWS credential provider to use to get dynamic credentials similar to the
     * AWS SDK. Setting a provider here will cause its credential values to be used
     * instead of the `accessKeyId`, `secretAccessKey`, and `sessionToken` settings.
     * @description The AWS credential provider to use to get dynamic credentials similar to the
     * AWS SDK. Setting a provider here will cause its credential values to be used
     * instead of the `accessKeyId`, `secretAccessKey`, and `sessionToken` settings.
     */
    credentialProvider?: unknown;
    generateId?: unknown;
}

export type P3ProviderOptions = P3AnthropicAwsProviderSettings;

interface P4AssemblyAIProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P4ProviderOptions = P4AssemblyAIProviderSettings;

interface P5AzureOpenAIProviderSettings {
    /**
     * Name of the Azure OpenAI resource. Either this or `baseURL` can be used.
     *
     * The resource name is used in the assembled URL: `https://{resourceName}.openai.azure.com/openai/v1{path}`.
     * @description Name of the Azure OpenAI resource. Either this or `baseURL` can be used.
     *
     * The resource name is used in the assembled URL: `https://{resourceName}.openai.azure.com/openai/v1{path}`.
     */
    resourceName?: string;
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers. Either this or `resourceName` can be used.
     * When a baseURL is provided, the resourceName is ignored.
     *
     * With an Azure OpenAI baseURL, the resolved URL is `{baseURL}/v1{path}`.
     * With a non-Azure custom gateway baseURL, the resolved URL is `{baseURL}{path}`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers. Either this or `resourceName` can be used.
     * When a baseURL is provided, the resourceName is ignored.
     *
     * With an Azure OpenAI baseURL, the resolved URL is `{baseURL}/v1{path}`.
     * With a non-Azure custom gateway baseURL, the resolved URL is `{baseURL}{path}`.
     */
    baseURL?: string;
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * A function that returns an access token for Microsoft Entra
     * (formerly known as Azure Active Directory), which will be invoked
     * on every request.
     * @description A function that returns an access token for Microsoft Entra
     * (formerly known as Azure Active Directory), which will be invoked
     * on every request.
     */
    tokenProvider?: unknown;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Custom api version to use. Defaults to `preview`.
     * @description Custom api version to use. Defaults to `preview`.
     */
    apiVersion?: string;
    /**
     * Use deployment-based URLs for specific model types. Set to true to use legacy deployment format:
     * `{baseURL}/deployments/{deploymentId}{path}?api-version={apiVersion}` instead of
     * `{baseURL}/v1{path}?api-version={apiVersion}`.
     * @description Use deployment-based URLs for specific model types. Set to true to use legacy deployment format:
     * `{baseURL}/deployments/{deploymentId}{path}?api-version={apiVersion}` instead of
     * `{baseURL}/v1{path}?api-version={apiVersion}`.
     */
    useDeploymentBasedUrls?: boolean;
}

export type P5ProviderOptions = P5AzureOpenAIProviderSettings;

interface P6BasetenProviderSettings {
    /**
     * Baseten API key. Default value is taken from the `BASETEN_API_KEY`
     * environment variable.
     * @description Baseten API key. Default value is taken from the `BASETEN_API_KEY`
     * environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the Model APIs. Default: 'https://inference.baseten.co/v1'
     * @description Base URL for the Model APIs. Default: 'https://inference.baseten.co/v1'
     */
    baseURL?: string;
    /**
     * Model URL for custom models (chat or embeddings).
     * If not supplied, the default Model APIs will be used.
     * @description Model URL for custom models (chat or embeddings).
     * If not supplied, the default Model APIs will be used.
     */
    modelURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P6ProviderOptions = P6BasetenProviderSettings;

interface P7BlackForestLabsProviderSettings {
    /**
     * Black Forest Labs API key. Default value is taken from the `BFL_API_KEY` environment variable.
     * @description Black Forest Labs API key. Default value is taken from the `BFL_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls. Defaults to `https://api.bfl.ai/v1`.
     * @description Base URL for the API calls. Defaults to `https://api.bfl.ai/v1`.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Poll interval in milliseconds between status checks. Defaults to 500ms.
     * @description Poll interval in milliseconds between status checks. Defaults to 500ms.
     */
    pollIntervalMillis?: number;
    /**
     * Overall timeout in milliseconds for polling before giving up. Defaults to 60s.
     * @description Overall timeout in milliseconds for polling before giving up. Defaults to 60s.
     */
    pollTimeoutMillis?: number;
}

export type P7ProviderOptions = P7BlackForestLabsProviderSettings;

interface P8ByteDanceProviderSettings {
    /**
     * ByteDance Ark API key. Default value is taken from the `ARK_API_KEY`
     * environment variable.
     * @description ByteDance Ark API key. Default value is taken from the `ARK_API_KEY`
     * environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * Default: https://ark.ap-southeast.bytepluses.com/api/v3
     * @description Base URL for the API calls.
     * Default: https://ark.ap-southeast.bytepluses.com/api/v3
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P8ProviderOptions = P8ByteDanceProviderSettings;

interface P9CerebrasProviderSettings {
    /**
     * Cerebras API key.
     * @description Cerebras API key.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P9ProviderOptions = P9CerebrasProviderSettings;

interface P10CohereProviderSettings {
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.cohere.com/v2`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.cohere.com/v2`.
     */
    baseURL?: string;
    /**
     * API key that is being send using the `Authorization` header.
     * It defaults to the `COHERE_API_KEY` environment variable.
     * @description API key that is being send using the `Authorization` header.
     * It defaults to the `COHERE_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Optional function to generate a unique ID for each request.
     * @description Optional function to generate a unique ID for each request.
     */
    generateId?: unknown;
}

export type P10ProviderOptions = P10CohereProviderSettings;

interface P11DeepgramProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P11ProviderOptions = P11DeepgramProviderSettings;

interface P12DeepInfraProviderSettings {
    /**
     * DeepInfra API key.
     * @description DeepInfra API key.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P12ProviderOptions = P12DeepInfraProviderSettings;

interface P13DeepSeekProviderSettings {
    /**
     * DeepSeek API key.
     * @description DeepSeek API key.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P13ProviderOptions = P13DeepSeekProviderSettings;

interface P14ElevenLabsProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P14ProviderOptions = P14ElevenLabsProviderSettings;

interface P15FalProviderSettings {
    /**
     * fal.ai API key. Default value is taken from the `FAL_API_KEY` environment
     * variable, falling back to `FAL_KEY`.
     * @description fal.ai API key. Default value is taken from the `FAL_API_KEY` environment
     * variable, falling back to `FAL_KEY`.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * The default prefix is `https://fal.run`.
     * @description Base URL for the API calls.
     * The default prefix is `https://fal.run`.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P15ProviderOptions = P15FalProviderSettings;

interface P16FireworksProviderSettings {
    /**
     * Fireworks API key. Default value is taken from the `FIREWORKS_API_KEY`
     * environment variable.
     * @description Fireworks API key. Default value is taken from the `FIREWORKS_API_KEY`
     * environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P16ProviderOptions = P16FireworksProviderSettings;

interface P17GatewayProviderSettings {
    /**
     * The base URL prefix for API calls. Defaults to `https://ai-gateway.vercel.sh/v4/ai`.
     * @description The base URL prefix for API calls. Defaults to `https://ai-gateway.vercel.sh/v4/ai`.
     */
    baseURL?: string;
    /**
     * API key or Vercel access token that is being sent using the `Authorization`
     * header. It defaults to the `AI_GATEWAY_API_KEY` environment variable.
     * @description API key or Vercel access token that is being sent using the `Authorization`
     * header. It defaults to the `AI_GATEWAY_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Vercel team ID or slug to scope requests for access tokens that can access
     * multiple teams.
     * @description Vercel team ID or slug to scope requests for access tokens that can access
     * multiple teams.
     */
    teamIdOrSlug?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * How frequently to refresh the metadata cache in milliseconds.
     * @description How frequently to refresh the metadata cache in milliseconds.
     */
    metadataCacheRefreshMillis?: number;
}

export type P17ProviderOptions = P17GatewayProviderSettings;

interface P18GladiaProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P18ProviderOptions = P18GladiaProviderSettings;

interface P19GoogleProviderSettings {
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://generativelanguage.googleapis.com/v1beta`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://generativelanguage.googleapis.com/v1beta`.
     */
    baseURL?: string;
    /**
     * API key that is being send using the `x-goog-api-key` header.
     * It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.
     * @description API key that is being send using the `x-goog-api-key` header.
     * It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string | undefined>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Optional function to generate a unique ID for each request.
     * @description Optional function to generate a unique ID for each request.
     */
    generateId?: unknown;
    /**
     * Custom provider name
     * Defaults to 'google.generative-ai'.
     * @description Custom provider name
     * Defaults to 'google.generative-ai'.
     */
    name?: string;
}

export type P19ProviderOptions = P19GoogleProviderSettings;

interface P20GoogleVertexProviderSettings extends P20GoogleVertexProviderSettings$1 {
    /**
     * Optional. The Authentication options provided by google-auth-library.
     * Complete list of authentication options is documented in the
     * GoogleAuthOptions interface:
     * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
     * @description Optional. The Authentication options provided by google-auth-library.
     * Complete list of authentication options is documented in the
     * GoogleAuthOptions interface:
     * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
     */
    googleAuthOptions?: unknown;
}

interface P20GoogleVertexProviderSettings$1 {
    /**
     * Optional. The API key for the Google Cloud project. If provided, the
     * provider will use express mode with API key authentication. Defaults to
     * the value of the `GOOGLE_VERTEX_API_KEY` environment variable.
     * @description Optional. The API key for the Google Cloud project. If provided, the
     * provider will use express mode with API key authentication. Defaults to
     * the value of the `GOOGLE_VERTEX_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Your Google Vertex location. Defaults to the environment variable `GOOGLE_VERTEX_LOCATION`.
     * @description Your Google Vertex location. Defaults to the environment variable `GOOGLE_VERTEX_LOCATION`.
     */
    location?: string;
    /**
     * Your Google Vertex project. Defaults to the environment variable `GOOGLE_VERTEX_PROJECT`.
     * @description Your Google Vertex project. Defaults to the environment variable `GOOGLE_VERTEX_PROJECT`.
     */
    project?: string;
    /**
     * Headers to use for requests. Can be:
     * - A headers object
     * - A Promise that resolves to a headers object
     * - A function that returns a headers object
     * - A function that returns a Promise of a headers object
     * @description Headers to use for requests. Can be:
     * - A headers object
     * - A Promise that resolves to a headers object
     * - A function that returns a headers object
     * - A function that returns a Promise of a headers object
     */
    headers?: unknown;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    generateId?: unknown;
    /**
     * Base URL for the Google Vertex API calls.
     * @description Base URL for the Google Vertex API calls.
     */
    baseURL?: string;
}

export type P20ProviderOptions = P20GoogleVertexProviderSettings;

interface P21GroqProviderSettings {
    /**
     * Base URL for the Groq API calls.
     * @description Base URL for the Groq API calls.
     */
    baseURL?: string;
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P21ProviderOptions = P21GroqProviderSettings;

interface P22HuggingFaceProviderSettings {
    /**
     * Hugging Face API key.
     * @description Hugging Face API key.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    generateId?: unknown;
}

export type P22ProviderOptions = P22HuggingFaceProviderSettings;

interface P23HumeProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P23ProviderOptions = P23HumeProviderSettings;

interface P24KlingAIProviderSettings {
    /**
     * KlingAI Access key. Default value is taken from the `KLINGAI_ACCESS_KEY`
     * environment variable.
     * @description KlingAI Access key. Default value is taken from the `KLINGAI_ACCESS_KEY`
     * environment variable.
     */
    accessKey?: string;
    /**
     * KlingAI Secret key. Default value is taken from the `KLINGAI_SECRET_KEY`
     * environment variable.
     * @description KlingAI Secret key. Default value is taken from the `KLINGAI_SECRET_KEY`
     * environment variable.
     */
    secretKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P24ProviderOptions = P24KlingAIProviderSettings;

interface P25LMNTProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P25ProviderOptions = P25LMNTProviderSettings;

interface P26LumaProviderSettings {
    /**
     * Luma API key. Default value is taken from the `LUMA_API_KEY` environment
     * variable.
     * @description Luma API key. Default value is taken from the `LUMA_API_KEY` environment
     * variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P26ProviderOptions = P26LumaProviderSettings;

interface P27MistralProviderSettings {
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.mistral.ai/v1`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.mistral.ai/v1`.
     */
    baseURL?: string;
    /**
     * API key that is being send using the `Authorization` header.
     * It defaults to the `MISTRAL_API_KEY` environment variable.
     * @description API key that is being send using the `Authorization` header.
     * It defaults to the `MISTRAL_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    generateId?: unknown;
}

export type P27ProviderOptions = P27MistralProviderSettings;

interface P28MoonshotAIProviderSettings {
    /**
     * Moonshot API key. Default value is taken from the `MOONSHOT_API_KEY`
     * environment variable.
     * @description Moonshot API key. Default value is taken from the `MOONSHOT_API_KEY`
     * environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P28ProviderOptions = P28MoonshotAIProviderSettings;

interface P29OpenResponsesProviderSettings {
    /**
     * URL for the Open Responses API POST endpoint.
     * @description URL for the Open Responses API POST endpoint.
     */
    url: string;
    /**
     * Provider name. Used as key for provider options and metadata.
     * @description Provider name. Used as key for provider options and metadata.
     */
    name: string;
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P29ProviderOptions = P29OpenResponsesProviderSettings;

interface P30OpenAIProviderSettings {
    /**
     * Base URL for the OpenAI API calls.
     * @description Base URL for the OpenAI API calls.
     */
    baseURL?: string;
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * OpenAI Organization.
     * @description OpenAI Organization.
     */
    organization?: string;
    /**
     * OpenAI project.
     * @description OpenAI project.
     */
    project?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Provider name. Overrides the `openai` default name for 3rd party providers.
     * @description Provider name. Overrides the `openai` default name for 3rd party providers.
     */
    name?: string;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Custom WebSocket implementation. This is useful for testing or for
     * runtimes that need a WebSocket constructor with header support.
     * @description Custom WebSocket implementation. This is useful for testing or for
     * runtimes that need a WebSocket constructor with header support.
     */
    webSocket?: unknown;
}

export type P30ProviderOptions = P30OpenAIProviderSettings;

interface P31OpenAICompatibleProviderSettings {
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL: string;
    /**
     * Provider name.
     * @description Provider name.
     */
    name: string;
    /**
     * API key for authenticating requests. If specified, adds an `Authorization`
     * header to request headers with the value `Bearer <apiKey>`. This will be added
     * before any headers potentially specified in the `headers` option.
     * @description API key for authenticating requests. If specified, adds an `Authorization`
     * header to request headers with the value `Bearer <apiKey>`. This will be added
     * before any headers potentially specified in the `headers` option.
     */
    apiKey?: string;
    /**
     * Optional custom headers to include in requests. These will be added to request headers
     * after any headers potentially added by use of the `apiKey` option.
     * @description Optional custom headers to include in requests. These will be added to request headers
     * after any headers potentially added by use of the `apiKey` option.
     */
    headers?: Record<string, string>;
    /**
     * Optional custom url query parameters to include in request urls.
     * @description Optional custom url query parameters to include in request urls.
     */
    queryParams?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Include usage information in streaming responses.
     * @description Include usage information in streaming responses.
     */
    includeUsage?: boolean;
    /**
     * Whether the provider supports structured outputs in chat models.
     * @description Whether the provider supports structured outputs in chat models.
     */
    supportsStructuredOutputs?: boolean;
    /**
     * Optional function to transform the request body before sending it to the API.
     * This is useful for proxy providers that may require a different request format
     * than the official OpenAI API.
     * @description Optional function to transform the request body before sending it to the API.
     * This is useful for proxy providers that may require a different request format
     * than the official OpenAI API.
     */
    transformRequestBody?: unknown;
    /**
     * Optional metadata extractor to capture provider-specific metadata from API responses.
     * This is useful for extracting non-standard fields, experimental features,
     * or provider-specific metrics from both streaming and non-streaming responses.
     * @description Optional metadata extractor to capture provider-specific metadata from API responses.
     * This is useful for extracting non-standard fields, experimental features,
     * or provider-specific metrics from both streaming and non-streaming responses.
     */
    metadataExtractor?: unknown;
    /**
     * The supported URLs for chat models.
     * @description The supported URLs for chat models.
     */
    supportedUrls?: unknown;
    /**
     * Optional usage converter for providers with token accounting semantics that
     * differ from the default OpenAI-compatible shape.
     * @description Optional usage converter for providers with token accounting semantics that
     * differ from the default OpenAI-compatible shape.
     */
    convertUsage?: unknown;
}

export type P31ProviderOptions = P31OpenAICompatibleProviderSettings;

interface P32PerplexityProviderSettings {
    /**
     * Base URL for the perplexity API calls.
     * @description Base URL for the perplexity API calls.
     */
    baseURL?: string;
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P32ProviderOptions = P32PerplexityProviderSettings;

interface P33ProdiaProviderSettings {
    /**
     * Prodia API key. Default value is taken from the `PRODIA_TOKEN` environment variable.
     * @description Prodia API key. Default value is taken from the `PRODIA_TOKEN` environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls. Defaults to `https://inference.prodia.com/v2`.
     * @description Base URL for the API calls. Defaults to `https://inference.prodia.com/v2`.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P33ProviderOptions = P33ProdiaProviderSettings;

interface P34QuiverAIProviderSettings {
    /**
     * QuiverAI API key. Default value is taken from the `QUIVERAI_API_KEY`
     * environment variable.
     * @description QuiverAI API key. Default value is taken from the `QUIVERAI_API_KEY`
     * environment variable.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls. Defaults to `https://api.quiver.ai/v1` and
     * falls back to the `QUIVERAI_BASE_URL` environment variable.
     * @description Base URL for the API calls. Defaults to `https://api.quiver.ai/v1` and
     * falls back to the `QUIVERAI_BASE_URL` environment variable.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P34ProviderOptions = P34QuiverAIProviderSettings;

interface P35ReplicateProviderSettings {
    /**
     * API token that is being send using the `Authorization` header.
     * It defaults to the `REPLICATE_API_TOKEN` environment variable.
     * @description API token that is being send using the `Authorization` header.
     * It defaults to the `REPLICATE_API_TOKEN` environment variable.
     */
    apiToken?: string;
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.replicate.com/v1`.
     * @description Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.replicate.com/v1`.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P35ProviderOptions = P35ReplicateProviderSettings;

interface P36RevaiProviderSettings {
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P36ProviderOptions = P36RevaiProviderSettings;

interface P37TogetherAIProviderSettings {
    /**
     * TogetherAI API key.
     * @description TogetherAI API key.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P37ProviderOptions = P37TogetherAIProviderSettings;

interface P38VercelProviderSettings {
    /**
     * Vercel API key.
     * @description Vercel API key.
     */
    apiKey?: string;
    /**
     * Base URL for the API calls.
     * @description Base URL for the API calls.
     */
    baseURL?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
}

export type P38ProviderOptions = P38VercelProviderSettings;

interface P39VoyageProviderSettings {
    baseURL?: string;
    apiKey?: string;
    headers?: Record<string, string>;
    fetch?: unknown;
}

export type P39ProviderOptions = P39VoyageProviderSettings;

interface P40XaiProviderSettings {
    /**
     * Base URL for the xAI API calls.
     * @description Base URL for the xAI API calls.
     */
    baseURL?: string;
    /**
     * API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
     * Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
     * Custom WebSocket implementation. Required in runtimes whose native
     * WebSocket constructor does not support headers for xAI streaming STT.
     * @description Custom WebSocket implementation. Required in runtimes whose native
     * WebSocket constructor does not support headers for xAI streaming STT.
     */
    webSocket?: unknown;
}

export type P40ProviderOptions = P40XaiProviderSettings;

interface P41OpenRouterProviderSettings {
    /**
  Base URL for the OpenRouter API calls.
     * @description Base URL for the OpenRouter API calls.
     */
    baseURL?: string;
    /**
  @deprecated Use `baseURL` instead.
       */
    baseUrl?: string;
    /**
  API key for authenticating requests.
     * @description API key for authenticating requests.
     */
    apiKey?: string;
    /**
  Custom headers to include in the requests.
     * @description Custom headers to include in the requests.
     */
    headers?: Record<string, string>;
    /**
  OpenRouter compatibility mode. Should be set to `strict` when using the OpenRouter API,
  and `compatible` when using 3rd party providers. In `compatible` mode, newer
  information such as streamOptions are not being sent. Defaults to 'compatible'.
     * @description OpenRouter compatibility mode. Should be set to `strict` when using the OpenRouter API,
     *   and `compatible` when using 3rd party providers. In `compatible` mode, newer
     *   information such as streamOptions are not being sent. Defaults to 'compatible'.
     */
    compatibility?: 'strict' | 'compatible';
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
     * @description Custom fetch implementation. You can use it as a middleware to intercept requests,
     *   or to provide a custom fetch implementation for e.g. testing.
     */
    fetch?: unknown;
    /**
  A JSON object to send as the request body to access OpenRouter features & upstream provider features.
     * @description A JSON object to send as the request body to access OpenRouter features & upstream provider features.
     */
    extraBody?: Record<string, unknown>;
    /**
     * Record of provider slugs to API keys for injecting into provider routing.
     * Maps provider slugs (e.g. "anthropic", "openai") to their respective API keys.
     * @description Record of provider slugs to API keys for injecting into provider routing.
     * Maps provider slugs (e.g. "anthropic", "openai") to their respective API keys.
     */
    api_keys?: Record<string, string>;
    /**
     * Your app's display name. Sets the `X-OpenRouter-Title` header on
     * every request for app attribution on the openrouter.ai dashboard.
     * @description Your app's display name. Sets the `X-OpenRouter-Title` header on
     * every request for app attribution on the openrouter.ai dashboard.
     */
    appName?: string;
    /**
     * Your app's URL or identifier. Sets the `HTTP-Referer` header on every request,
     * used to identify your app on the openrouter.ai dashboard.
     * @description Your app's URL or identifier. Sets the `HTTP-Referer` header on every request,
     * used to identify your app on the openrouter.ai dashboard.
     */
    appUrl?: string;
}

export type P41ProviderOptions = P41OpenRouterProviderSettings;

