import { Type } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';

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
      return {
        type: 'array',
        items: { $ref: getSchemaPath(data.model) },
      };

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

export function apiSuccessResponseSchema(data: DataSchema) {
  return {
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Success' },
        errors: { nullable: true, example: null },
        timestamp: { type: 'string', example: '2026-02-05T13:14:03.294Z' },
        data: buildDataSchema(data),
      },
      required: ['success', 'message', 'data', 'errors', 'timestamp'],
    },
  };
}
