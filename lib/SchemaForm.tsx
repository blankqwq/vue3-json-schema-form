import { defineComponent, PropType } from 'vue'
import { Schema } from './types'
import SchemaItem from './SchemaItem'

export default defineComponent({
  props: {
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
  },
  setup(props) {
    return () => {
      const { schema, value } = props
      const onChange = (v: any) => {
        props.onChange(v)
      }
      return (
        <SchemaItem
          schema={schema}
          onChange={onChange}
          value={value}
        ></SchemaItem>
      )
    }
  },
})
