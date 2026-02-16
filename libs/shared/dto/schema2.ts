import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessEnvelopeDto } from './envelop';

type PrimitiveType = 'string' | 'number' | 'boolean' | 'integer';

type DataSchema =
  | { kind: 'model'; model: Type<unknown> }
  | { kind: 'modelArray'; model: Type<unknown> }
  | { kind: 'primitive'; type: PrimitiveType; example?: unknown }
  | { kind: 'primitiveArray'; type: PrimitiveType; example?: unknown };

function buildDataSchema(data: DataSchema) {
  switch (data.kind) {
    case 'model':
      return { $ref: getSchemaPath(data.model) };
    case 'modelArray':
      return { type: 'array', items: { $ref: getSchemaPath(data.model) } };
    case 'primitive':
      return {
        type: data.type,
        ...(data.example !== undefined ? { example: data.example } : {}),
      };
    case 'primitiveArray':
      return {
        type: 'array',
        items: {
          type: data.type,
          ...(data.example !== undefined ? { example: data.example } : {}),
        },
      };
  }
}

function extractModels(data: DataSchema): Type<unknown>[] {
  return data.kind === 'model' || data.kind === 'modelArray'
    ? [data.model]
    : [];
}

export function ApiSuccessResponse(data: DataSchema) {
  const models = extractModels(data);

  return applyDecorators(
    ApiExtraModels(ApiSuccessEnvelopeDto, ...models),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessEnvelopeDto) },
          {
            type: 'object',
            properties: {
              data: buildDataSchema(data),
            },
            required: ['data'],
          },
        ],
      },
    }),
  );
}
