// biome-ignore-all format: This file is deterministically generated.
import type { ProviderOptionsSchemaEntry } from "./types.js";

export const PROVIDER_OPTIONS_SCHEMAS: Readonly<Record<string, ProviderOptionsSchemaEntry>> = {
  "@ai-sdk/alibaba": {
    "factoryName": "createAlibaba",
    "packageName": "@ai-sdk/alibaba",
    "packageVersion": "2.0.16",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key that is being sent using the `Authorization` header.\nIt defaults to the `ALIBABA_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers or regional endpoints.\nThe default prefix is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`.",
          "type": "string"
        },
        "embeddingBaseURL": {
          "description": "Use a different URL prefix for embedding API calls.\nThe embedding API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).\nThe default prefix is `https://dashscope-intl.aliyuncs.com/api/v1`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "includeUsage": {
          "default": true,
          "description": "Include usage information in streaming responses.\nWhen enabled, token usage will be included in the final chunk.",
          "type": "boolean"
        },
        "videoBaseURL": {
          "description": "Use a different URL prefix for video generation API calls.\nThe video API uses the DashScope native endpoint (not the OpenAI-compatible endpoint).\nThe default prefix is `https://dashscope-intl.aliyuncs.com`.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/amazon-bedrock": {
    "factoryName": "createAmazonBedrock",
    "packageName": "@ai-sdk/amazon-bedrock",
    "packageVersion": "5.0.27",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "accessKeyId": {
          "description": "The AWS access key ID to use for the Bedrock provider. Defaults to the value of the\n`AWS_ACCESS_KEY_ID` environment variable.",
          "type": "string"
        },
        "apiKey": {
          "description": "API key for authenticating requests using Bearer token authentication.\nWhen provided, this will be used instead of AWS SigV4 authentication.\nDefaults to the value of the `AWS_BEARER_TOKEN_BEDROCK` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the Bedrock API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "region": {
          "description": "The AWS region to use for the Bedrock provider. Defaults to the value of the\n`AWS_REGION` environment variable.",
          "type": "string"
        },
        "secretAccessKey": {
          "description": "The AWS secret access key to use for the Bedrock provider. Defaults to the value of the\n`AWS_SECRET_ACCESS_KEY` environment variable.",
          "type": "string"
        },
        "sessionToken": {
          "description": "The AWS session token to use for the Bedrock provider. When `accessKeyId` and\n`secretAccessKey` are both passed explicitly as options, only this field is used\nIf either access key field is omitted and resolved from the environment, the\nsession token also falls back to `AWS_SESSION_TOKEN` when not set here.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unsupported_optional",
        "path": "credentialProvider"
      },
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/anthropic": {
    "factoryName": "createAnthropic",
    "packageName": "@ai-sdk/anthropic",
    "packageVersion": "4.0.18",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key that is being send using the `x-api-key` header.\nIt defaults to the `ANTHROPIC_API_KEY` environment variable.\nOnly one of `apiKey` or `authToken` is required.",
          "type": "string"
        },
        "authToken": {
          "description": "Auth token that is being sent using the `Authorization: Bearer` header.\nIt defaults to the `ANTHROPIC_AUTH_TOKEN` environment variable.\nOnly one of `apiKey` or `authToken` is required.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.anthropic.com/v1`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "name": {
          "description": "Custom provider name\nDefaults to 'anthropic.messages'.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/anthropic-aws": {
    "factoryName": "createAnthropicAws",
    "packageName": "@ai-sdk/anthropic-aws",
    "packageVersion": "2.0.10",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "accessKeyId": {
          "description": "The AWS access key ID to use for SigV4 authentication. Defaults to the value of the\n`AWS_ACCESS_KEY_ID` environment variable.",
          "type": "string"
        },
        "apiKey": {
          "description": "API key for authenticating requests via the `x-api-key` header.\nWhen provided, this will be used instead of AWS SigV4 authentication.\nDefaults to the value of the `ANTHROPIC_AWS_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the Claude Platform on AWS API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "anyOf": [
              {
                "type": "string"
              },
              {}
            ],
            "description": "Custom headers to include in the requests."
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "region": {
          "description": "The AWS region to use for Claude Platform on AWS. Defaults to the value of the\n`AWS_REGION` environment variable. Required — there is no fallback default.",
          "type": "string"
        },
        "secretAccessKey": {
          "description": "The AWS secret access key to use for SigV4 authentication. Defaults to the value of the\n`AWS_SECRET_ACCESS_KEY` environment variable.",
          "type": "string"
        },
        "sessionToken": {
          "description": "The AWS session token to use for SigV4 authentication. Defaults to the value of the\n`AWS_SESSION_TOKEN` environment variable.",
          "type": "string"
        },
        "workspaceId": {
          "description": "The Anthropic workspace ID for this AWS account. Sent on every request via the\n`anthropic-workspace-id` header. Defaults to the value of the\n`ANTHROPIC_AWS_WORKSPACE_ID` environment variable.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unsupported_optional",
        "path": "credentialProvider"
      },
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/assemblyai": {
    "factoryName": "createAssemblyAI",
    "packageName": "@ai-sdk/assemblyai",
    "packageVersion": "3.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/azure": {
    "factoryName": "createAzure",
    "packageName": "@ai-sdk/azure",
    "packageVersion": "4.0.18",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "apiVersion": {
          "description": "Custom api version to use. Defaults to `preview`.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers. Either this or `resourceName` can be used.\nWhen a baseURL is provided, the resourceName is ignored.\n\nWith an Azure OpenAI baseURL, the resolved URL is `{baseURL}/v1{path}`.\nWith a non-Azure custom gateway baseURL, the resolved URL is `{baseURL}{path}`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "resourceName": {
          "description": "Name of the Azure OpenAI resource. Either this or `baseURL` can be used.\n\nThe resource name is used in the assembled URL: `https://{resourceName}.openai.azure.com/openai/v1{path}`.",
          "type": "string"
        },
        "useDeploymentBasedUrls": {
          "description": "Use deployment-based URLs for specific model types. Set to true to use legacy deployment format:\n`{baseURL}/deployments/{deploymentId}{path}?api-version={apiVersion}` instead of\n`{baseURL}/v1{path}?api-version={apiVersion}`.",
          "type": "boolean"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "tokenProvider"
      }
    ]
  },
  "@ai-sdk/baseten": {
    "factoryName": "createBaseten",
    "packageName": "@ai-sdk/baseten",
    "packageVersion": "2.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Baseten API key. Default value is taken from the `BASETEN_API_KEY`\nenvironment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the Model APIs. Default: 'https://inference.baseten.co/v1'",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "modelURL": {
          "description": "Model URL for custom models (chat or embeddings).\nIf not supplied, the default Model APIs will be used.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/black-forest-labs": {
    "factoryName": "createBlackForestLabs",
    "packageName": "@ai-sdk/black-forest-labs",
    "packageVersion": "2.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Black Forest Labs API key. Default value is taken from the `BFL_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls. Defaults to `https://api.bfl.ai/v1`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "pollIntervalMillis": {
          "description": "Poll interval in milliseconds between status checks. Defaults to 500ms.",
          "type": "number"
        },
        "pollTimeoutMillis": {
          "description": "Overall timeout in milliseconds for polling before giving up. Defaults to 60s.",
          "type": "number"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/bytedance": {
    "factoryName": "createByteDance",
    "packageName": "@ai-sdk/bytedance",
    "packageVersion": "2.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "ByteDance Ark API key. Default value is taken from the `ARK_API_KEY`\nenvironment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.\nDefault: https://ark.ap-southeast.bytepluses.com/api/v3",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/cerebras": {
    "factoryName": "createCerebras",
    "packageName": "@ai-sdk/cerebras",
    "packageVersion": "3.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Cerebras API key.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/cohere": {
    "factoryName": "createCohere",
    "packageName": "@ai-sdk/cohere",
    "packageVersion": "4.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key that is being send using the `Authorization` header.\nIt defaults to the `COHERE_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.cohere.com/v2`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/deepgram": {
    "factoryName": "createDeepgram",
    "packageName": "@ai-sdk/deepgram",
    "packageVersion": "3.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/deepinfra": {
    "factoryName": "createDeepInfra",
    "packageName": "@ai-sdk/deepinfra",
    "packageVersion": "3.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "DeepInfra API key.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/deepseek": {
    "factoryName": "createDeepSeek",
    "packageName": "@ai-sdk/deepseek",
    "packageVersion": "3.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "DeepSeek API key.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/elevenlabs": {
    "factoryName": "createElevenLabs",
    "packageName": "@ai-sdk/elevenlabs",
    "packageVersion": "3.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/fal": {
    "factoryName": "createFal",
    "packageName": "@ai-sdk/fal",
    "packageVersion": "3.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "fal.ai API key. Default value is taken from the `FAL_API_KEY` environment\nvariable, falling back to `FAL_KEY`.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.\nThe default prefix is `https://fal.run`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/fireworks": {
    "factoryName": "createFireworks",
    "packageName": "@ai-sdk/fireworks",
    "packageVersion": "3.0.15",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Fireworks API key. Default value is taken from the `FIREWORKS_API_KEY`\nenvironment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/gateway": {
    "factoryName": "createGateway",
    "packageName": "@ai-sdk/gateway",
    "packageVersion": "4.0.26",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key or Vercel access token that is being sent using the `Authorization`\nheader. It defaults to the `AI_GATEWAY_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "The base URL prefix for API calls. Defaults to `https://ai-gateway.vercel.sh/v4/ai`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "metadataCacheRefreshMillis": {
          "description": "How frequently to refresh the metadata cache in milliseconds.",
          "type": "number"
        },
        "teamIdOrSlug": {
          "description": "Vercel team ID or slug to scope requests for access tokens that can access\nmultiple teams.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unresolved_optional",
        "path": "webSocket"
      }
    ]
  },
  "@ai-sdk/gladia": {
    "factoryName": "createGladia",
    "packageName": "@ai-sdk/gladia",
    "packageVersion": "3.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/google": {
    "factoryName": "createGoogle",
    "packageName": "@ai-sdk/google",
    "packageVersion": "4.0.21",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key that is being send using the `x-goog-api-key` header.\nIt defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://generativelanguage.googleapis.com/v1beta`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "anyOf": [
              {
                "type": "string"
              },
              {}
            ],
            "description": "Custom headers to include in the requests."
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "name": {
          "description": "Custom provider name\nDefaults to 'google.generative-ai'.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/google-vertex": {
    "factoryName": "createGoogleVertex",
    "packageName": "@ai-sdk/google-vertex",
    "packageVersion": "5.0.25",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Optional. The API key for the Google Cloud project. If provided, the\nprovider will use express mode with API key authentication. Defaults to\nthe value of the `GOOGLE_VERTEX_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the Google Vertex API calls.",
          "type": "string"
        },
        "location": {
          "description": "Your Google Vertex location. Defaults to the environment variable `GOOGLE_VERTEX_LOCATION`.",
          "type": "string"
        },
        "project": {
          "description": "Your Google Vertex project. Defaults to the environment variable `GOOGLE_VERTEX_PROJECT`.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      },
      {
        "code": "unresolved_optional",
        "path": "googleAuthOptions"
      },
      {
        "code": "unresolved_optional",
        "path": "headers"
      }
    ]
  },
  "@ai-sdk/google-vertex/anthropic": {
    "factoryName": "createVertexAnthropic",
    "packageName": "@ai-sdk/google-vertex/anthropic",
    "packageVersion": "5.0.25",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.anthropic.com/v1`.",
          "type": "string"
        },
        "location": {
          "description": "Google Cloud region. Defaults to the value of the `GOOGLE_VERTEX_LOCATION` environment variable.",
          "type": "string"
        },
        "project": {
          "description": "Google Cloud project ID. Defaults to the value of the `GOOGLE_VERTEX_PROJECT` environment variable.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateAuthToken"
      },
      {
        "code": "unresolved_optional",
        "path": "googleAuthOptions"
      },
      {
        "code": "unresolved_optional",
        "path": "headers"
      }
    ]
  },
  "@ai-sdk/groq": {
    "factoryName": "createGroq",
    "packageName": "@ai-sdk/groq",
    "packageVersion": "4.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the Groq API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/huggingface": {
    "factoryName": "createHuggingFace",
    "packageName": "@ai-sdk/huggingface",
    "packageVersion": "2.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Hugging Face API key.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/hume": {
    "factoryName": "createHume",
    "packageName": "@ai-sdk/hume",
    "packageVersion": "3.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/klingai": {
    "factoryName": "createKlingAI",
    "packageName": "@ai-sdk/klingai",
    "packageVersion": "4.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "accessKey": {
          "description": "KlingAI Access key. Default value is taken from the `KLINGAI_ACCESS_KEY`\nenvironment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "secretKey": {
          "description": "KlingAI Secret key. Default value is taken from the `KLINGAI_SECRET_KEY`\nenvironment variable.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/lmnt": {
    "factoryName": "createLMNT",
    "packageName": "@ai-sdk/lmnt",
    "packageVersion": "3.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/luma": {
    "factoryName": "createLuma",
    "packageName": "@ai-sdk/luma",
    "packageVersion": "3.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Luma API key. Default value is taken from the `LUMA_API_KEY` environment\nvariable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/mistral": {
    "factoryName": "createMistral",
    "packageName": "@ai-sdk/mistral",
    "packageVersion": "4.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key that is being send using the `Authorization` header.\nIt defaults to the `MISTRAL_API_KEY` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.mistral.ai/v1`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "generateId"
      }
    ]
  },
  "@ai-sdk/moonshotai": {
    "factoryName": "createMoonshotAI",
    "packageName": "@ai-sdk/moonshotai",
    "packageVersion": "3.0.17",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Moonshot API key. Default value is taken from the `MOONSHOT_API_KEY`\nenvironment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/open-responses": {
    "factoryName": "createOpenResponses",
    "packageName": "@ai-sdk/open-responses",
    "packageVersion": "2.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "name": {
          "description": "Provider name. Used as key for provider options and metadata.",
          "type": "string"
        },
        "url": {
          "description": "URL for the Open Responses API POST endpoint.",
          "type": "string"
        }
      },
      "required": [
        "url",
        "name"
      ],
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/openai": {
    "factoryName": "createOpenAI",
    "packageName": "@ai-sdk/openai",
    "packageVersion": "4.0.17",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the OpenAI API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "name": {
          "description": "Provider name. Overrides the `openai` default name for 3rd party providers.",
          "type": "string"
        },
        "organization": {
          "description": "OpenAI Organization.",
          "type": "string"
        },
        "project": {
          "description": "OpenAI project.",
          "type": "string"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unresolved_optional",
        "path": "webSocket"
      }
    ]
  },
  "@ai-sdk/openai-compatible": {
    "factoryName": "createOpenAICompatible",
    "packageName": "@ai-sdk/openai-compatible",
    "packageVersion": "3.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests. If specified, adds an `Authorization`\nheader to request headers with the value `Bearer <apiKey>`. This will be added\nbefore any headers potentially specified in the `headers` option.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Optional custom headers to include in requests. These will be added to request headers\nafter any headers potentially added by use of the `apiKey` option.",
            "type": "string"
          },
          "description": "Optional custom headers to include in requests. These will be added to request headers\nafter any headers potentially added by use of the `apiKey` option.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "includeUsage": {
          "description": "Include usage information in streaming responses.",
          "type": "boolean"
        },
        "name": {
          "description": "Provider name.",
          "type": "string"
        },
        "queryParams": {
          "additionalProperties": {
            "description": "Optional custom url query parameters to include in request urls.",
            "type": "string"
          },
          "description": "Optional custom url query parameters to include in request urls.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "supportsStructuredOutputs": {
          "description": "Whether the provider supports structured outputs in chat models.",
          "type": "boolean"
        }
      },
      "required": [
        "baseURL"
      ],
      "type": "object"
    },
    "warnings": [
      {
        "code": "unsupported_optional",
        "path": "convertUsage"
      },
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unsupported_optional",
        "path": "metadataExtractor"
      },
      {
        "code": "unsupported_optional",
        "path": "supportedUrls"
      },
      {
        "code": "unsupported_optional",
        "path": "transformRequestBody"
      }
    ]
  },
  "@ai-sdk/perplexity": {
    "factoryName": "createPerplexity",
    "packageName": "@ai-sdk/perplexity",
    "packageVersion": "4.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the perplexity API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/prodia": {
    "factoryName": "createProdia",
    "packageName": "@ai-sdk/prodia",
    "packageVersion": "2.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Prodia API key. Default value is taken from the `PRODIA_TOKEN` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls. Defaults to `https://inference.prodia.com/v2`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/quiverai": {
    "factoryName": "createQuiverAI",
    "packageName": "@ai-sdk/quiverai",
    "packageVersion": "2.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "QuiverAI API key. Default value is taken from the `QUIVERAI_API_KEY`\nenvironment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls. Defaults to `https://api.quiver.ai/v1` and\nfalls back to the `QUIVERAI_BASE_URL` environment variable.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/replicate": {
    "factoryName": "createReplicate",
    "packageName": "@ai-sdk/replicate",
    "packageVersion": "3.0.13",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiToken": {
          "description": "API token that is being send using the `Authorization` header.\nIt defaults to the `REPLICATE_API_TOKEN` environment variable.",
          "type": "string"
        },
        "baseURL": {
          "description": "Use a different URL prefix for API calls, e.g. to use proxy servers.\nThe default prefix is `https://api.replicate.com/v1`.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/revai": {
    "factoryName": "createRevai",
    "packageName": "@ai-sdk/revai",
    "packageVersion": "3.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/togetherai": {
    "factoryName": "createTogetherAI",
    "packageName": "@ai-sdk/togetherai",
    "packageVersion": "3.0.15",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "TogetherAI API key.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/vercel": {
    "factoryName": "createVercel",
    "packageName": "@ai-sdk/vercel",
    "packageVersion": "3.0.14",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "Vercel API key.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/voyage": {
    "factoryName": "createVoyage",
    "packageName": "@ai-sdk/voyage",
    "packageVersion": "2.0.12",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "type": "string"
        },
        "baseURL": {
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "type": "string"
          },
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      }
    ]
  },
  "@ai-sdk/xai": {
    "factoryName": "createXai",
    "packageName": "@ai-sdk/xai",
    "packageVersion": "4.0.18",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the xAI API calls.",
          "type": "string"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unresolved_optional",
        "path": "fetch"
      },
      {
        "code": "unresolved_optional",
        "path": "webSocket"
      }
    ]
  },
  "@openrouter/ai-sdk-provider": {
    "factoryName": "createOpenRouter",
    "packageName": "@openrouter/ai-sdk-provider",
    "packageVersion": "3.0.0",
    "schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "additionalProperties": true,
      "properties": {
        "apiKey": {
          "description": "API key for authenticating requests.",
          "type": "string"
        },
        "api_keys": {
          "additionalProperties": {
            "description": "Record of provider slugs to API keys for injecting into provider routing.\nMaps provider slugs (e.g. \"anthropic\", \"openai\") to their respective API keys.",
            "type": "string"
          },
          "description": "Record of provider slugs to API keys for injecting into provider routing.\nMaps provider slugs (e.g. \"anthropic\", \"openai\") to their respective API keys.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "appName": {
          "description": "Your app's display name. Sets the `X-OpenRouter-Title` header on\nevery request for app attribution on the openrouter.ai dashboard.",
          "type": "string"
        },
        "appUrl": {
          "description": "Your app's URL or identifier. Sets the `HTTP-Referer` header on every request,\nused to identify your app on the openrouter.ai dashboard.",
          "type": "string"
        },
        "baseURL": {
          "description": "Base URL for the OpenRouter API calls.",
          "type": "string"
        },
        "baseUrl": {
          "type": "string"
        },
        "compatibility": {
          "anyOf": [
            {
              "const": "strict",
              "type": "string"
            },
            {
              "const": "compatible",
              "type": "string"
            }
          ],
          "description": "OpenRouter compatibility mode. Should be set to `strict` when using the OpenRouter API,\nand `compatible` when using 3rd party providers. In `compatible` mode, newer\ninformation such as streamOptions are not being sent. Defaults to 'compatible'."
        },
        "extraBody": {
          "additionalProperties": {
            "description": "A JSON object to send as the request body to access OpenRouter features & upstream provider features."
          },
          "description": "A JSON object to send as the request body to access OpenRouter features & upstream provider features.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "headers": {
          "additionalProperties": {
            "description": "Custom headers to include in the requests.",
            "type": "string"
          },
          "description": "Custom headers to include in the requests.",
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        }
      },
      "type": "object"
    },
    "warnings": [
      {
        "code": "unsupported_optional",
        "path": "fetch"
      }
    ]
  }
};
