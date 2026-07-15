// biome-ignore-all format: This file is deterministically generated.
import { z } from "zod";

const P0AlibabaProviderSettingsSchema = z.object({
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers or regional endpoints.
     * The default prefix is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers or regional endpoints.\nThe default prefix is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`."),
    /**
     * Use a different URL prefix for video generation API calls.
     * The video API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).
     * The default prefix is `https://dashscope-intl.aliyuncs.com`.
     */
    videoBaseURL: z.string().optional().describe("Use a different URL prefix for video generation API calls.\nThe video API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).\nThe default prefix is `https://dashscope-intl.aliyuncs.com`."),
    /**
     * Use a different URL prefix for embedding API calls.
     * The embedding API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).
     * The default prefix is `https://dashscope-intl.aliyuncs.com/api/v1`.
     */
    embeddingBaseURL: z.string().optional().describe("Use a different URL prefix for embedding API calls.\nThe embedding API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).\nThe default prefix is `https://dashscope-intl.aliyuncs.com/api/v1`."),
    /**
     * API key that is being sent using the `Authorization` header.
     * It defaults to the `ALIBABA_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("API key that is being sent using the `Authorization` header.\nIt defaults to the `ALIBABA_API_KEY` environment variable."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Include usage information in streaming responses.
     * When enabled, token usage will be included in the final chunk.
     *
     * @default true
     */
    includeUsage: z.boolean().optional().describe("Include usage information in streaming responses.\nWhen enabled, token usage will be included in the final chunk.").default(true)
});

export const P0ProviderOptionsSchema = P0AlibabaProviderSettingsSchema;
const P1AmazonBedrockProviderSettingsSchema = z.object({
    /**
     * The AWS region to use for the Bedrock provider. Defaults to the value of the
     * `AWS_REGION` environment variable.
     */
    region: z.string().optional().describe("The AWS region to use for the Bedrock provider. Defaults to the value of the\n`AWS_REGION` environment variable."),
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
     */
    apiKey: z.string().optional().describe("API key for authenticating requests using Bearer token authentication.\nWhen provided, this will be used instead of AWS SigV4 authentication.\nDefaults to the value of the `AWS_BEARER_TOKEN_BEDROCK` environment variable."),
    /**
     * The AWS access key ID to use for the Bedrock provider. Defaults to the value of the
     * `AWS_ACCESS_KEY_ID` environment variable.
     */
    accessKeyId: z.string().optional().describe("The AWS access key ID to use for the Bedrock provider. Defaults to the value of the\n`AWS_ACCESS_KEY_ID` environment variable."),
    /**
     * The AWS secret access key to use for the Bedrock provider. Defaults to the value of the
     * `AWS_SECRET_ACCESS_KEY` environment variable.
     */
    secretAccessKey: z.string().optional().describe("The AWS secret access key to use for the Bedrock provider. Defaults to the value of the\n`AWS_SECRET_ACCESS_KEY` environment variable."),
    /**
     * The AWS session token to use for the Bedrock provider. When `accessKeyId` and
     * `secretAccessKey` are both passed explicitly as options, only this field is used
     * If either access key field is omitted and resolved from the environment, the
     * session token also falls back to `AWS_SESSION_TOKEN` when not set here.
     */
    sessionToken: z.string().optional().describe("The AWS session token to use for the Bedrock provider. When `accessKeyId` and\n`secretAccessKey` are both passed explicitly as options, only this field is used\nIf either access key field is omitted and resolved from the environment, the\nsession token also falls back to `AWS_SESSION_TOKEN` when not set here."),
    /**
     * Base URL for the Bedrock API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the Bedrock API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * The AWS credential provider to use for the Bedrock provider to get dynamic
     * credentials similar to the AWS SDK. Setting a provider here will cause its
     * credential values to be used instead of the `accessKeyId`, `secretAccessKey`,
     * and `sessionToken` settings.
     */
    credentialProvider: z.unknown().optional().describe("The AWS credential provider to use for the Bedrock provider to get dynamic\ncredentials similar to the AWS SDK. Setting a provider here will cause its\ncredential values to be used instead of the `accessKeyId`, `secretAccessKey`,\nand `sessionToken` settings."),
    generateId: z.unknown().optional()
});

export const P1ProviderOptionsSchema = P1AmazonBedrockProviderSettingsSchema;
const P2AnthropicProviderSettingsSchema = z.object({
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.anthropic.com/v1`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.anthropic.com/v1`."),
    /**
     * API key that is being send using the `x-api-key` header.
     * It defaults to the `ANTHROPIC_API_KEY` environment variable.
     * Only one of `apiKey` or `authToken` is required.
     */
    apiKey: z.string().optional().describe("API key that is being send using the `x-api-key` header.\nIt defaults to the `ANTHROPIC_API_KEY` environment variable.\nOnly one of `apiKey` or `authToken` is required."),
    /**
     * Auth token that is being sent using the `Authorization: Bearer` header.
     * It defaults to the `ANTHROPIC_AUTH_TOKEN` environment variable.
     * Only one of `apiKey` or `authToken` is required.
     */
    authToken: z.string().optional().describe("Auth token that is being sent using the `Authorization: Bearer` header.\nIt defaults to the `ANTHROPIC_AUTH_TOKEN` environment variable.\nOnly one of `apiKey` or `authToken` is required."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    generateId: z.unknown().optional(),
    /**
     * Custom provider name
     * Defaults to 'anthropic.messages'.
     */
    name: z.string().optional().describe("Custom provider name\nDefaults to 'anthropic.messages'.")
});

export const P2ProviderOptionsSchema = P2AnthropicProviderSettingsSchema;
const P3AnthropicAwsProviderSettingsSchema = z.object({
    /**
     * The AWS region to use for Claude Platform on AWS. Defaults to the value of the
     * `AWS_REGION` environment variable. Required — there is no fallback default.
     */
    region: z.string().optional().describe("The AWS region to use for Claude Platform on AWS. Defaults to the value of the\n`AWS_REGION` environment variable. Required \u2014 there is no fallback default."),
    /**
     * The Anthropic workspace ID for this AWS account. Sent on every request via the
     * `anthropic-workspace-id` header. Defaults to the value of the
     * `ANTHROPIC_AWS_WORKSPACE_ID` environment variable.
     */
    workspaceId: z.string().optional().describe("The Anthropic workspace ID for this AWS account. Sent on every request via the\n`anthropic-workspace-id` header. Defaults to the value of the\n`ANTHROPIC_AWS_WORKSPACE_ID` environment variable."),
    /**
     * API key for authenticating requests via the `x-api-key` header.
     * When provided, this will be used instead of AWS SigV4 authentication.
     * Defaults to the value of the `ANTHROPIC_AWS_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests via the `x-api-key` header.\nWhen provided, this will be used instead of AWS SigV4 authentication.\nDefaults to the value of the `ANTHROPIC_AWS_API_KEY` environment variable."),
    /**
     * The AWS access key ID to use for SigV4 authentication. Defaults to the value of the
     * `AWS_ACCESS_KEY_ID` environment variable.
     */
    accessKeyId: z.string().optional().describe("The AWS access key ID to use for SigV4 authentication. Defaults to the value of the\n`AWS_ACCESS_KEY_ID` environment variable."),
    /**
     * The AWS secret access key to use for SigV4 authentication. Defaults to the value of the
     * `AWS_SECRET_ACCESS_KEY` environment variable.
     */
    secretAccessKey: z.string().optional().describe("The AWS secret access key to use for SigV4 authentication. Defaults to the value of the\n`AWS_SECRET_ACCESS_KEY` environment variable."),
    /**
     * The AWS session token to use for SigV4 authentication. Defaults to the value of the
     * `AWS_SESSION_TOKEN` environment variable.
     */
    sessionToken: z.string().optional().describe("The AWS session token to use for SigV4 authentication. Defaults to the value of the\n`AWS_SESSION_TOKEN` environment variable."),
    /**
     * Base URL for the Claude Platform on AWS API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the Claude Platform on AWS API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.union([z.string(), z.undefined()]).describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * The AWS credential provider to use to get dynamic credentials similar to the
     * AWS SDK. Setting a provider here will cause its credential values to be used
     * instead of the `accessKeyId`, `secretAccessKey`, and `sessionToken` settings.
     */
    credentialProvider: z.unknown().optional().describe("The AWS credential provider to use to get dynamic credentials similar to the\nAWS SDK. Setting a provider here will cause its credential values to be used\ninstead of the `accessKeyId`, `secretAccessKey`, and `sessionToken` settings."),
    generateId: z.unknown().optional()
});

export const P3ProviderOptionsSchema = P3AnthropicAwsProviderSettingsSchema;
const P4AssemblyAIProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P4ProviderOptionsSchema = P4AssemblyAIProviderSettingsSchema;
const P5AzureOpenAIProviderSettingsSchema = z.object({
    /**
     * Name of the Azure OpenAI resource. Either this or `baseURL` can be used.
     *
     * The resource name is used in the assembled URL: `https://{resourceName}.openai.azure.com/openai/v1{path}`.
     */
    resourceName: z.string().optional().describe("Name of the Azure OpenAI resource. Either this or `baseURL` can be used.\n\nThe resource name is used in the assembled URL: `https://{resourceName}.openai.azure.com/openai/v1{path}`."),
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers. Either this or `resourceName` can be used.
     * When a baseURL is provided, the resourceName is ignored.
     *
     * With an Azure OpenAI baseURL, the resolved URL is `{baseURL}/v1{path}`.
     * With a non-Azure custom gateway baseURL, the resolved URL is `{baseURL}{path}`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers. Either this or `resourceName` can be used.\nWhen a baseURL is provided, the resourceName is ignored.\n\nWith an Azure OpenAI baseURL, the resolved URL is `{baseURL}/v1{path}`.\nWith a non-Azure custom gateway baseURL, the resolved URL is `{baseURL}{path}`."),
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * A function that returns an access token for Microsoft Entra
     * (formerly known as Azure Active Directory), which will be invoked
     * on every request.
     */
    tokenProvider: z.unknown().optional().describe("A function that returns an access token for Microsoft Entra\n(formerly known as Azure Active Directory), which will be invoked\non every request."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Custom api version to use. Defaults to `preview`.
     */
    apiVersion: z.string().optional().describe("Custom api version to use. Defaults to `preview`."),
    /**
     * Use deployment-based URLs for specific model types. Set to true to use legacy deployment format:
     * `{baseURL}/deployments/{deploymentId}{path}?api-version={apiVersion}` instead of
     * `{baseURL}/v1{path}?api-version={apiVersion}`.
     */
    useDeploymentBasedUrls: z.boolean().optional().describe("Use deployment-based URLs for specific model types. Set to true to use legacy deployment format:\n`{baseURL}/deployments/{deploymentId}{path}?api-version={apiVersion}` instead of\n`{baseURL}/v1{path}?api-version={apiVersion}`.")
});

export const P5ProviderOptionsSchema = P5AzureOpenAIProviderSettingsSchema;
const P6BasetenProviderSettingsSchema = z.object({
    /**
     * Baseten API key. Default value is taken from the `BASETEN_API_KEY`
     * environment variable.
     */
    apiKey: z.string().optional().describe("Baseten API key. Default value is taken from the `BASETEN_API_KEY`\nenvironment variable."),
    /**
     * Base URL for the Model APIs. Default: 'https://inference.baseten.co/v1'
     */
    baseURL: z.string().optional().describe("Base URL for the Model APIs. Default: 'https://inference.baseten.co/v1'"),
    /**
     * Model URL for custom models (chat or embeddings).
     * If not supplied, the default Model APIs will be used.
     */
    modelURL: z.string().optional().describe("Model URL for custom models (chat or embeddings).\nIf not supplied, the default Model APIs will be used."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P6ProviderOptionsSchema = P6BasetenProviderSettingsSchema;
const P7BlackForestLabsProviderSettingsSchema = z.object({
    /**
     * Black Forest Labs API key. Default value is taken from the `BFL_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("Black Forest Labs API key. Default value is taken from the `BFL_API_KEY` environment variable."),
    /**
     * Base URL for the API calls. Defaults to `https://api.bfl.ai/v1`.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls. Defaults to `https://api.bfl.ai/v1`."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept\nrequests, or to provide a custom fetch implementation for e.g. testing."),
    /**
     * Poll interval in milliseconds between status checks. Defaults to 500ms.
     */
    pollIntervalMillis: z.number().optional().describe("Poll interval in milliseconds between status checks. Defaults to 500ms."),
    /**
     * Overall timeout in milliseconds for polling before giving up. Defaults to 60s.
     */
    pollTimeoutMillis: z.number().optional().describe("Overall timeout in milliseconds for polling before giving up. Defaults to 60s.")
});

export const P7ProviderOptionsSchema = P7BlackForestLabsProviderSettingsSchema;
const P8ByteDanceProviderSettingsSchema = z.object({
    /**
     * ByteDance Ark API key. Default value is taken from the `ARK_API_KEY`
     * environment variable.
     */
    apiKey: z.string().optional().describe("ByteDance Ark API key. Default value is taken from the `ARK_API_KEY`\nenvironment variable."),
    /**
     * Base URL for the API calls.
     * Default: https://ark.ap-southeast.bytepluses.com/api/v3
     */
    baseURL: z.string().optional().describe("Base URL for the API calls.\nDefault: https://ark.ap-southeast.bytepluses.com/api/v3"),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept\nrequests, or to provide a custom fetch implementation for e.g. testing.")
});

export const P8ProviderOptionsSchema = P8ByteDanceProviderSettingsSchema;
const P9CerebrasProviderSettingsSchema = z.object({
    /**
     * Cerebras API key.
     */
    apiKey: z.string().optional().describe("Cerebras API key."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P9ProviderOptionsSchema = P9CerebrasProviderSettingsSchema;
const P10CohereProviderSettingsSchema = z.object({
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.cohere.com/v2`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.cohere.com/v2`."),
    /**
     * API key that is being send using the `Authorization` header.
     * It defaults to the `COHERE_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("API key that is being send using the `Authorization` header.\nIt defaults to the `COHERE_API_KEY` environment variable."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Optional function to generate a unique ID for each request.
     */
    generateId: z.unknown().optional().describe("Optional function to generate a unique ID for each request.")
});

export const P10ProviderOptionsSchema = P10CohereProviderSettingsSchema;
const P11DeepgramProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P11ProviderOptionsSchema = P11DeepgramProviderSettingsSchema;
const P12DeepInfraProviderSettingsSchema = z.object({
    /**
     * DeepInfra API key.
     */
    apiKey: z.string().optional().describe("DeepInfra API key."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P12ProviderOptionsSchema = P12DeepInfraProviderSettingsSchema;
const P13DeepSeekProviderSettingsSchema = z.object({
    /**
     * DeepSeek API key.
     */
    apiKey: z.string().optional().describe("DeepSeek API key."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P13ProviderOptionsSchema = P13DeepSeekProviderSettingsSchema;
const P14ElevenLabsProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P14ProviderOptionsSchema = P14ElevenLabsProviderSettingsSchema;
const P15FalProviderSettingsSchema = z.object({
    /**
     * fal.ai API key. Default value is taken from the `FAL_API_KEY` environment
     * variable, falling back to `FAL_KEY`.
     */
    apiKey: z.string().optional().describe("fal.ai API key. Default value is taken from the `FAL_API_KEY` environment\nvariable, falling back to `FAL_KEY`."),
    /**
     * Base URL for the API calls.
     * The default prefix is `https://fal.run`.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls.\nThe default prefix is `https://fal.run`."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept\nrequests, or to provide a custom fetch implementation for e.g. testing.")
});

export const P15ProviderOptionsSchema = P15FalProviderSettingsSchema;
const P16FireworksProviderSettingsSchema = z.object({
    /**
     * Fireworks API key. Default value is taken from the `FIREWORKS_API_KEY`
     * environment variable.
     */
    apiKey: z.string().optional().describe("Fireworks API key. Default value is taken from the `FIREWORKS_API_KEY`\nenvironment variable."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P16ProviderOptionsSchema = P16FireworksProviderSettingsSchema;
const P17GatewayProviderSettingsSchema = z.object({
    /**
     * The base URL prefix for API calls. Defaults to `https://ai-gateway.vercel.sh/v4/ai`.
     */
    baseURL: z.string().optional().describe("The base URL prefix for API calls. Defaults to `https://ai-gateway.vercel.sh/v4/ai`."),
    /**
     * API key or Vercel access token that is being sent using the `Authorization`
     * header. It defaults to the `AI_GATEWAY_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("API key or Vercel access token that is being sent using the `Authorization`\nheader. It defaults to the `AI_GATEWAY_API_KEY` environment variable."),
    /**
     * Vercel team ID or slug to scope requests for access tokens that can access
     * multiple teams.
     */
    teamIdOrSlug: z.string().optional().describe("Vercel team ID or slug to scope requests for access tokens that can access\nmultiple teams."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Custom WebSocket implementation used for streaming transcription. This is
     * useful for testing or for runtimes without a global WebSocket. A
     * header-capable implementation is not required — Gateway WebSocket auth is
     * carried in the subprotocols.
     */
    webSocket: z.unknown().optional().describe("Custom WebSocket implementation used for streaming transcription. This is\nuseful for testing or for runtimes without a global WebSocket. A\nheader-capable implementation is not required \u2014 Gateway WebSocket auth is\ncarried in the subprotocols."),
    /**
     * How frequently to refresh the metadata cache in milliseconds.
     */
    metadataCacheRefreshMillis: z.number().optional().describe("How frequently to refresh the metadata cache in milliseconds.")
});

export const P17ProviderOptionsSchema = P17GatewayProviderSettingsSchema;
const P18GladiaProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P18ProviderOptionsSchema = P18GladiaProviderSettingsSchema;
const P19GoogleProviderSettingsSchema = z.object({
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://generativelanguage.googleapis.com/v1beta`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://generativelanguage.googleapis.com/v1beta`."),
    /**
     * API key that is being send using the `x-goog-api-key` header.
     * It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("API key that is being send using the `x-goog-api-key` header.\nIt defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.union([z.string(), z.undefined()]).describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Optional function to generate a unique ID for each request.
     */
    generateId: z.unknown().optional().describe("Optional function to generate a unique ID for each request."),
    /**
     * Custom provider name
     * Defaults to 'google.generative-ai'.
     */
    name: z.string().optional().describe("Custom provider name\nDefaults to 'google.generative-ai'.")
});

export const P19ProviderOptionsSchema = P19GoogleProviderSettingsSchema;
const P20GoogleVertexProviderSettings$1Schema = z.object({
    /**
     * Optional. The API key for the Google Cloud project. If provided, the
     * provider will use express mode with API key authentication. Defaults to
     * the value of the `GOOGLE_VERTEX_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("Optional. The API key for the Google Cloud project. If provided, the\nprovider will use express mode with API key authentication. Defaults to\nthe value of the `GOOGLE_VERTEX_API_KEY` environment variable."),
    /**
     * Your Google Vertex location. Defaults to the environment variable `GOOGLE_VERTEX_LOCATION`.
     */
    location: z.string().optional().describe("Your Google Vertex location. Defaults to the environment variable `GOOGLE_VERTEX_LOCATION`."),
    /**
     * Your Google Vertex project. Defaults to the environment variable `GOOGLE_VERTEX_PROJECT`.
     */
    project: z.string().optional().describe("Your Google Vertex project. Defaults to the environment variable `GOOGLE_VERTEX_PROJECT`."),
    /**
     * Headers to use for requests. Can be:
     * - A headers object
     * - A Promise that resolves to a headers object
     * - A function that returns a headers object
     * - A function that returns a Promise of a headers object
     */
    headers: z.unknown().optional().describe("Headers to use for requests. Can be:\n- A headers object\n- A Promise that resolves to a headers object\n- A function that returns a headers object\n- A function that returns a Promise of a headers object"),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    generateId: z.unknown().optional(),
    /**
     * Base URL for the Google Vertex API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the Google Vertex API calls.")
});

const P20GoogleVertexProviderSettingsSchema = P20GoogleVertexProviderSettings$1Schema.extend({
    /**
     * Optional. The Authentication options provided by google-auth-library.
     * Complete list of authentication options is documented in the
     * GoogleAuthOptions interface:
     * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
     */
    googleAuthOptions: z.unknown().optional().describe("Optional. The Authentication options provided by google-auth-library.\nComplete list of authentication options is documented in the\nGoogleAuthOptions interface:\nhttps://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.")
});

export const P20ProviderOptionsSchema = P20GoogleVertexProviderSettingsSchema;
const P21GoogleVertexAnthropicProviderSettings$1Schema = z.object({
    /**
     * Google Cloud project ID. Defaults to the value of the `GOOGLE_VERTEX_PROJECT` environment variable.
     */
    project: z.string().optional().describe("Google Cloud project ID. Defaults to the value of the `GOOGLE_VERTEX_PROJECT` environment variable."),
    /**
     * Google Cloud region. Defaults to the value of the `GOOGLE_VERTEX_LOCATION` environment variable.
     */
    location: z.string().optional().describe("Google Cloud region. Defaults to the value of the `GOOGLE_VERTEX_LOCATION` environment variable."),
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.anthropic.com/v1`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.anthropic.com/v1`."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.unknown().optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

const P21GoogleVertexAnthropicProviderSettingsSchema = P21GoogleVertexAnthropicProviderSettings$1Schema.extend({
    /**
     * Optional. The Authentication options provided by google-auth-library.
     * Complete list of authentication options is documented in the
     * GoogleAuthOptions interface:
     * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
     */
    googleAuthOptions: z.unknown().optional().describe("Optional. The Authentication options provided by google-auth-library.\nComplete list of authentication options is documented in the\nGoogleAuthOptions interface:\nhttps://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts."),
    /**
     * Optional. Override the Bearer token generator. Defaults to OAuth exchange
     * via `google-auth-library` with `googleAuthOptions`.
     */
    generateAuthToken: z.unknown().optional().describe("Optional. Override the Bearer token generator. Defaults to OAuth exchange\nvia `google-auth-library` with `googleAuthOptions`.")
});

export const P21ProviderOptionsSchema = P21GoogleVertexAnthropicProviderSettingsSchema;
const P22GroqProviderSettingsSchema = z.object({
    /**
     * Base URL for the Groq API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the Groq API calls."),
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P22ProviderOptionsSchema = P22GroqProviderSettingsSchema;
const P23HuggingFaceProviderSettingsSchema = z.object({
    /**
     * Hugging Face API key.
     */
    apiKey: z.string().optional().describe("Hugging Face API key."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    generateId: z.unknown().optional()
});

export const P23ProviderOptionsSchema = P23HuggingFaceProviderSettingsSchema;
const P24HumeProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P24ProviderOptionsSchema = P24HumeProviderSettingsSchema;
const P25KlingAIProviderSettingsSchema = z.object({
    /**
     * KlingAI Access key. Default value is taken from the `KLINGAI_ACCESS_KEY`
     * environment variable.
     */
    accessKey: z.string().optional().describe("KlingAI Access key. Default value is taken from the `KLINGAI_ACCESS_KEY`\nenvironment variable."),
    /**
     * KlingAI Secret key. Default value is taken from the `KLINGAI_SECRET_KEY`
     * environment variable.
     */
    secretKey: z.string().optional().describe("KlingAI Secret key. Default value is taken from the `KLINGAI_SECRET_KEY`\nenvironment variable."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept\nrequests, or to provide a custom fetch implementation for e.g. testing.")
});

export const P25ProviderOptionsSchema = P25KlingAIProviderSettingsSchema;
const P26LMNTProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P26ProviderOptionsSchema = P26LMNTProviderSettingsSchema;
const P27LumaProviderSettingsSchema = z.object({
    /**
     * Luma API key. Default value is taken from the `LUMA_API_KEY` environment
     * variable.
     */
    apiKey: z.string().optional().describe("Luma API key. Default value is taken from the `LUMA_API_KEY` environment\nvariable."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P27ProviderOptionsSchema = P27LumaProviderSettingsSchema;
const P28MistralProviderSettingsSchema = z.object({
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.mistral.ai/v1`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.mistral.ai/v1`."),
    /**
     * API key that is being send using the `Authorization` header.
     * It defaults to the `MISTRAL_API_KEY` environment variable.
     */
    apiKey: z.string().optional().describe("API key that is being send using the `Authorization` header.\nIt defaults to the `MISTRAL_API_KEY` environment variable."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    generateId: z.unknown().optional()
});

export const P28ProviderOptionsSchema = P28MistralProviderSettingsSchema;
const P29MoonshotAIProviderSettingsSchema = z.object({
    /**
     * Moonshot API key. Default value is taken from the `MOONSHOT_API_KEY`
     * environment variable.
     */
    apiKey: z.string().optional().describe("Moonshot API key. Default value is taken from the `MOONSHOT_API_KEY`\nenvironment variable."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P29ProviderOptionsSchema = P29MoonshotAIProviderSettingsSchema;
const P30OpenResponsesProviderSettingsSchema = z.object({
    /**
     * URL for the Open Responses API POST endpoint.
     */
    url: z.string().describe("URL for the Open Responses API POST endpoint."),
    /**
     * Provider name. Used as key for provider options and metadata.
     */
    name: z.string().describe("Provider name. Used as key for provider options and metadata."),
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P30ProviderOptionsSchema = P30OpenResponsesProviderSettingsSchema;
const P31OpenAIProviderSettingsSchema = z.object({
    /**
     * Base URL for the OpenAI API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the OpenAI API calls."),
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * OpenAI Organization.
     */
    organization: z.string().optional().describe("OpenAI Organization."),
    /**
     * OpenAI project.
     */
    project: z.string().optional().describe("OpenAI project."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Provider name. Overrides the `openai` default name for 3rd party providers.
     */
    name: z.string().optional().describe("Provider name. Overrides the `openai` default name for 3rd party providers."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Custom WebSocket implementation. This is useful for testing or for
     * runtimes that need a WebSocket constructor with header support.
     */
    webSocket: z.unknown().optional().describe("Custom WebSocket implementation. This is useful for testing or for\nruntimes that need a WebSocket constructor with header support.")
});

export const P31ProviderOptionsSchema = P31OpenAIProviderSettingsSchema;
const P32OpenAICompatibleProviderSettingsSchema = z.object({
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().describe("Base URL for the API calls."),
    /**
     * Provider name.
     */
    name: z.string().describe("Provider name."),
    /**
     * API key for authenticating requests. If specified, adds an `Authorization`
     * header to request headers with the value `Bearer <apiKey>`. This will be added
     * before any headers potentially specified in the `headers` option.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests. If specified, adds an `Authorization`\nheader to request headers with the value `Bearer <apiKey>`. This will be added\nbefore any headers potentially specified in the `headers` option."),
    /**
     * Optional custom headers to include in requests. These will be added to request headers
     * after any headers potentially added by use of the `apiKey` option.
     */
    headers: z.record(z.string(), z.string().describe("Optional custom headers to include in requests. These will be added to request headers\nafter any headers potentially added by use of the `apiKey` option.")).optional().describe("Optional custom headers to include in requests. These will be added to request headers\nafter any headers potentially added by use of the `apiKey` option."),
    /**
     * Optional custom url query parameters to include in request urls.
     */
    queryParams: z.record(z.string(), z.string().describe("Optional custom url query parameters to include in request urls.")).optional().describe("Optional custom url query parameters to include in request urls."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Include usage information in streaming responses.
     */
    includeUsage: z.boolean().optional().describe("Include usage information in streaming responses."),
    /**
     * Whether the provider supports structured outputs in chat models.
     */
    supportsStructuredOutputs: z.boolean().optional().describe("Whether the provider supports structured outputs in chat models."),
    /**
     * Optional function to transform the request body before sending it to the API.
     * This is useful for proxy providers that may require a different request format
     * than the official OpenAI API.
     */
    transformRequestBody: z.unknown().optional().describe("Optional function to transform the request body before sending it to the API.\nThis is useful for proxy providers that may require a different request format\nthan the official OpenAI API."),
    /**
     * Optional metadata extractor to capture provider-specific metadata from API responses.
     * This is useful for extracting non-standard fields, experimental features,
     * or provider-specific metrics from both streaming and non-streaming responses.
     */
    metadataExtractor: z.unknown().optional().describe("Optional metadata extractor to capture provider-specific metadata from API responses.\nThis is useful for extracting non-standard fields, experimental features,\nor provider-specific metrics from both streaming and non-streaming responses."),
    /**
     * The supported URLs for chat models.
     */
    supportedUrls: z.unknown().optional().describe("The supported URLs for chat models."),
    /**
     * Optional usage converter for providers with token accounting semantics that
     * differ from the default OpenAI-compatible shape.
     */
    convertUsage: z.unknown().optional().describe("Optional usage converter for providers with token accounting semantics that\ndiffer from the default OpenAI-compatible shape.")
});

export const P32ProviderOptionsSchema = P32OpenAICompatibleProviderSettingsSchema;
const P33PerplexityProviderSettingsSchema = z.object({
    /**
     * Base URL for the perplexity API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the perplexity API calls."),
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P33ProviderOptionsSchema = P33PerplexityProviderSettingsSchema;
const P34ProdiaProviderSettingsSchema = z.object({
    /**
     * Prodia API key. Default value is taken from the `PRODIA_TOKEN` environment variable.
     */
    apiKey: z.string().optional().describe("Prodia API key. Default value is taken from the `PRODIA_TOKEN` environment variable."),
    /**
     * Base URL for the API calls. Defaults to `https://inference.prodia.com/v2`.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls. Defaults to `https://inference.prodia.com/v2`."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept\nrequests, or to provide a custom fetch implementation for e.g. testing.")
});

export const P34ProviderOptionsSchema = P34ProdiaProviderSettingsSchema;
const P35QuiverAIProviderSettingsSchema = z.object({
    /**
     * QuiverAI API key. Default value is taken from the `QUIVERAI_API_KEY`
     * environment variable.
     */
    apiKey: z.string().optional().describe("QuiverAI API key. Default value is taken from the `QUIVERAI_API_KEY`\nenvironment variable."),
    /**
     * Base URL for the API calls. Defaults to `https://api.quiver.ai/v1` and
     * falls back to the `QUIVERAI_BASE_URL` environment variable.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls. Defaults to `https://api.quiver.ai/v1` and\nfalls back to the `QUIVERAI_BASE_URL` environment variable."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept
     * requests, or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept\nrequests, or to provide a custom fetch implementation for e.g. testing.")
});

export const P35ProviderOptionsSchema = P35QuiverAIProviderSettingsSchema;
const P36ReplicateProviderSettingsSchema = z.object({
    /**
     * API token that is being send using the `Authorization` header.
     * It defaults to the `REPLICATE_API_TOKEN` environment variable.
     */
    apiToken: z.string().optional().describe("API token that is being send using the `Authorization` header.\nIt defaults to the `REPLICATE_API_TOKEN` environment variable."),
    /**
     * Use a different URL prefix for API calls, e.g. to use proxy servers.
     * The default prefix is `https://api.replicate.com/v1`.
     */
    baseURL: z.string().optional().describe("Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.replicate.com/v1`."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P36ProviderOptionsSchema = P36ReplicateProviderSettingsSchema;
const P37RevaiProviderSettingsSchema = z.object({
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P37ProviderOptionsSchema = P37RevaiProviderSettingsSchema;
const P38TogetherAIProviderSettingsSchema = z.object({
    /**
     * TogetherAI API key.
     */
    apiKey: z.string().optional().describe("TogetherAI API key."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P38ProviderOptionsSchema = P38TogetherAIProviderSettingsSchema;
const P39VercelProviderSettingsSchema = z.object({
    /**
     * Vercel API key.
     */
    apiKey: z.string().optional().describe("Vercel API key."),
    /**
     * Base URL for the API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the API calls."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing.")
});

export const P39ProviderOptionsSchema = P39VercelProviderSettingsSchema;
const P40VoyageProviderSettingsSchema = z.object({
    baseURL: z.string().optional(),
    apiKey: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    fetch: z.unknown().optional()
});

export const P40ProviderOptionsSchema = P40VoyageProviderSettingsSchema;
const P41XaiProviderSettingsSchema = z.object({
    /**
     * Base URL for the xAI API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the xAI API calls."),
    /**
     * API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
     * Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
     * Custom fetch implementation. You can use it as a middleware to intercept requests,
     * or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
     * Custom WebSocket implementation. Required in runtimes whose native
     * WebSocket constructor does not support headers for xAI streaming STT.
     */
    webSocket: z.unknown().optional().describe("Custom WebSocket implementation. Required in runtimes whose native\nWebSocket constructor does not support headers for xAI streaming STT.")
});

export const P41ProviderOptionsSchema = P41XaiProviderSettingsSchema;
const P42OpenRouterProviderSettingsSchema = z.object({
    /**
  Base URL for the OpenRouter API calls.
     */
    baseURL: z.string().optional().describe("Base URL for the OpenRouter API calls."),
    /**
  @deprecated Use `baseURL` instead.
       */
    baseUrl: z.string().optional(),
    /**
  API key for authenticating requests.
     */
    apiKey: z.string().optional().describe("API key for authenticating requests."),
    /**
  Custom headers to include in the requests.
     */
    headers: z.record(z.string(), z.string().describe("Custom headers to include in the requests.")).optional().describe("Custom headers to include in the requests."),
    /**
  OpenRouter compatibility mode. Should be set to `strict` when using the OpenRouter API,
  and `compatible` when using 3rd party providers. In `compatible` mode, newer
  information such as streamOptions are not being sent. Defaults to 'compatible'.
     */
    compatibility: z.union([z.literal("strict"), z.literal("compatible")]).optional().describe("OpenRouter compatibility mode. Should be set to `strict` when using the OpenRouter API,\nand `compatible` when using 3rd party providers. In `compatible` mode, newer\ninformation such as streamOptions are not being sent. Defaults to 'compatible'."),
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
     */
    fetch: z.unknown().optional().describe("Custom fetch implementation. You can use it as a middleware to intercept requests,\nor to provide a custom fetch implementation for e.g. testing."),
    /**
  A JSON object to send as the request body to access OpenRouter features & upstream provider features.
     */
    extraBody: z.record(z.string(), z.unknown().describe("A JSON object to send as the request body to access OpenRouter features & upstream provider features.")).optional().describe("A JSON object to send as the request body to access OpenRouter features & upstream provider features."),
    /**
     * Record of provider slugs to API keys for injecting into provider routing.
     * Maps provider slugs (e.g. "anthropic", "openai") to their respective API keys.
     */
    api_keys: z.record(z.string(), z.string().describe("Record of provider slugs to API keys for injecting into provider routing.\nMaps provider slugs (e.g. \"anthropic\", \"openai\") to their respective API keys.")).optional().describe("Record of provider slugs to API keys for injecting into provider routing.\nMaps provider slugs (e.g. \"anthropic\", \"openai\") to their respective API keys."),
    /**
     * Your app's display name. Sets the `X-OpenRouter-Title` header on
     * every request for app attribution on the openrouter.ai dashboard.
     */
    appName: z.string().optional().describe("Your app's display name. Sets the `X-OpenRouter-Title` header on\nevery request for app attribution on the openrouter.ai dashboard."),
    /**
     * Your app's URL or identifier. Sets the `HTTP-Referer` header on every request,
     * used to identify your app on the openrouter.ai dashboard.
     */
    appUrl: z.string().optional().describe("Your app's URL or identifier. Sets the `HTTP-Referer` header on every request,\nused to identify your app on the openrouter.ai dashboard.")
});

export const P42ProviderOptionsSchema = P42OpenRouterProviderSettingsSchema;

export const PROVIDER_OPTIONS_ZOD_SCHEMAS: Readonly<Record<string, z.ZodType>> = {
  "@ai-sdk/alibaba": P0ProviderOptionsSchema,
  "@ai-sdk/amazon-bedrock": P1ProviderOptionsSchema,
  "@ai-sdk/anthropic": P2ProviderOptionsSchema,
  "@ai-sdk/anthropic-aws": P3ProviderOptionsSchema,
  "@ai-sdk/assemblyai": P4ProviderOptionsSchema,
  "@ai-sdk/azure": P5ProviderOptionsSchema,
  "@ai-sdk/baseten": P6ProviderOptionsSchema,
  "@ai-sdk/black-forest-labs": P7ProviderOptionsSchema,
  "@ai-sdk/bytedance": P8ProviderOptionsSchema,
  "@ai-sdk/cerebras": P9ProviderOptionsSchema,
  "@ai-sdk/cohere": P10ProviderOptionsSchema,
  "@ai-sdk/deepgram": P11ProviderOptionsSchema,
  "@ai-sdk/deepinfra": P12ProviderOptionsSchema,
  "@ai-sdk/deepseek": P13ProviderOptionsSchema,
  "@ai-sdk/elevenlabs": P14ProviderOptionsSchema,
  "@ai-sdk/fal": P15ProviderOptionsSchema,
  "@ai-sdk/fireworks": P16ProviderOptionsSchema,
  "@ai-sdk/gateway": P17ProviderOptionsSchema,
  "@ai-sdk/gladia": P18ProviderOptionsSchema,
  "@ai-sdk/google": P19ProviderOptionsSchema,
  "@ai-sdk/google-vertex": P20ProviderOptionsSchema,
  "@ai-sdk/google-vertex/anthropic": P21ProviderOptionsSchema,
  "@ai-sdk/groq": P22ProviderOptionsSchema,
  "@ai-sdk/huggingface": P23ProviderOptionsSchema,
  "@ai-sdk/hume": P24ProviderOptionsSchema,
  "@ai-sdk/klingai": P25ProviderOptionsSchema,
  "@ai-sdk/lmnt": P26ProviderOptionsSchema,
  "@ai-sdk/luma": P27ProviderOptionsSchema,
  "@ai-sdk/mistral": P28ProviderOptionsSchema,
  "@ai-sdk/moonshotai": P29ProviderOptionsSchema,
  "@ai-sdk/open-responses": P30ProviderOptionsSchema,
  "@ai-sdk/openai": P31ProviderOptionsSchema,
  "@ai-sdk/openai-compatible": P32ProviderOptionsSchema.partial({ "name": true }).meta(P32ProviderOptionsSchema.meta() ?? {}),
  "@ai-sdk/perplexity": P33ProviderOptionsSchema,
  "@ai-sdk/prodia": P34ProviderOptionsSchema,
  "@ai-sdk/quiverai": P35ProviderOptionsSchema,
  "@ai-sdk/replicate": P36ProviderOptionsSchema,
  "@ai-sdk/revai": P37ProviderOptionsSchema,
  "@ai-sdk/togetherai": P38ProviderOptionsSchema,
  "@ai-sdk/vercel": P39ProviderOptionsSchema,
  "@ai-sdk/voyage": P40ProviderOptionsSchema,
  "@ai-sdk/xai": P41ProviderOptionsSchema,
  "@openrouter/ai-sdk-provider": P42ProviderOptionsSchema,
};
