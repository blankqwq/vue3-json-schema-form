// or ESM/TypeScript import
// import Ajv from 'ajv'
// Node.js require:
const Ajv = require('ajv')

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const localize = require('ajv-i18n/localize/zh')

// number没有format
ajv.addFormat('hahah', function fun(data) {
  console.log(data)
  // 自定义错误，需要挂到属性那里了？
  fun.errors = [
    {
      instancePath: '/bar',
      schemaPath: '#/properties/bar/format',
      keyword: 'format',
      params: { format: 'hahah' },
      message: 'sadsad',
    },
  ]
  console.log(fun)
  return true
})

ajv.addKeyword('bar', {
  // inline 速度扩展
  macro() {
    // console.log(schema, data)
    // 扩展schema
    return {}
  },
  // 错误挂在对象上
  validate: (schema, data) => {
    //these parameters are deprecated, see docs for addKeyword
    console.log(schema, data)
    // this.errors = [
    //   {
    //     instancePath: '/bar',
    //     schemaPath: '#/properties/bar/format',
    //     keyword: 'format',
    //     params: { format: 'hahah' },
    //     message: 'sadsad',
    //   },
    // ]
    return false
  },
  compile(sch, parentSchema) {
    // 实现required_if ...
    console.log(sch, parentSchema)
    return () => true
  },
  errors: false,
})

const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string', format: 'hahah', bar: 'test' },
    test: {
      type: 'array',
      // items: [
      //   {
      //     type: 'string',
      //   },
      // ],
      items: {
        type: 'string',
      },
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

const data = {
  foo: '1',
  bar: 'abc',
  test: ['asd'],
}

const validate = ajv.compile(schema)
const valid = validate(data)
// 直接修改内容
localize(validate.errors)
if (!valid) console.log(validate.errors)
