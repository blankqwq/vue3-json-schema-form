import { defineComponent, PropType } from 'vue'
import { FieldItemProps, Schema, SchemaTypes } from './types'
import StringField from './item/StringField'

export default defineComponent({
  props: FieldItemProps,
  setup(props) {
    // 中间层，外层需要设置样式等信息
    const createComponent = (type: string) => {
      if (SchemaTypes.STRING == type) {
        return <StringField></StringField>
      }
    }
    return () => {
      const schema = props.schema
      return createComponent(schema.type)
    }
  },
})
