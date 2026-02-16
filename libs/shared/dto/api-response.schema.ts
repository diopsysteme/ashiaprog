import { Type } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';

export function apiSuccessSchema<TModel extends Type<unknown>>(model: TModel) {
  return {
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            errors: { nullable: true, example: null },
            timestamp: { type: 'string', example: '2026-02-05T13:14:03.294Z' },
          },
          required: ['success', 'message', 'data', 'errors', 'timestamp'],
        },
        {
          properties: {
            data: { $ref: getSchemaPath(model) },
          },
        },
      ],
    },
  };
}

export function apiSuccessArraySchema<TModel extends Type<unknown>>(
  model: TModel,
) {
  return {
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            errors: { nullable: true, example: null },
            timestamp: { type: 'string', example: '2026-02-05T13:14:03.294Z' },
          },
          required: ['success', 'message', 'data', 'errors', 'timestamp'],
        },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(model) },
            },
          },
        },
      ],
    },
  };
}
