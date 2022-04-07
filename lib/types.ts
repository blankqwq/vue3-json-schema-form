import { PropType } from 'vue'

type SchemaRef = { $ref: string }

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

export interface Schema {
  type: SchemaTypes | string
  const?: any
  format?: string
  default?: any
  properties?: {
    [key: string]: Schema | { $ref: string }
  }
  items?: Schema | Schema[] | SchemaRef
  depandencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  required?: string[]
  enum?: any
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema
}

export const FieldItemProps = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const
