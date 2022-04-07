import { defineComponent, reactive, Ref, ref, watchEffect } from 'vue'
import { createUseStyles } from 'vue-jss'
import MonacoEditor from '@/components/MonacoEditor'
import demos from '@/demos'
import SchemaForm from '../lib/SchemaForm'
// import Schema from '../lib'

const useStyle = createUseStyles({
  container: {},
  title: {
    textAlign: 'center',
  },
  schemaEditor: {
    height: 300,
  },
  editorContainer: {
    display: 'flex',
    margin: '20px auto',
    'justify-content': 'center',
  },
  uiSchemaEditor: {
    width: '49%',
    height: 350,
    'margin-right': '2%',
  },
  valueEditor: {
    width: '49%',
    height: 350,
  },
  otherEditor: {
    display: 'flex',
  },
  component: {
    width: 500,
    border: '1px solid #333',
  },
  code: {
    width: 600,
    flexShrink: 0,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    borderRadius: 5,
    '&:hover': {
      background: '#efefef',
    },
  },
  menuSelected: {
    background: '#337ab7',
    color: '#fff',
    '&:hover': {
      background: '#337ab7',
    },
  },
  dataSelect: {
    width: 500,
    margin: '0 auto',
  },
})

function toJson(val: any) {
  return JSON.stringify(val, null, 2)
}

type Schema = any
type UISchema = any

export default defineComponent({
  name: 'App',
  setup() {
    const selectedRef: Ref<number> = ref(0)
    const demo: {
      schema: Schema | null
      data: any
      uiSchema: UISchema | null
      schemaCode: string
      dataCode: string
      uiSchemaCode: string
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
    })

    watchEffect(() => {
      const index = selectedRef.value
      const d = demos[index]
      demo.schema = d.schema
      demo.data = d.default
      demo.uiSchema = d.uiSchema
      demo.schemaCode = toJson(d.schema)
      demo.dataCode = toJson(d.default)
      demo.uiSchemaCode = toJson(d.uiSchema)
    })
    const handleCodeChangeFactor = (
      filed: 'schema' | 'uiSchema' | 'data',
      code: string,
    ) => {
      try {
        demo[filed] = JSON.parse(code)
        demo[`${filed}Code`] = code
      } catch (err) {
        return
      }
    }
    const handleSchemaCodeChange = (v: string) =>
      handleCodeChangeFactor('schema', v)
    const handleUISchemaCodeChange = (v: string) =>
      handleCodeChangeFactor('uiSchema', v)
    const handleDataCodeChange = (v: string) =>
      handleCodeChangeFactor('data', v)

    const style = useStyle()
    return () => {
      const classes = style.value
      const selected = selectedRef.value
      return (
        <div class={classes.container}>
          <div class={classes.title}>
            <h1>Vue3-Json-Schema</h1>
          </div>
          <div class={classes.dataSelect}>
            {demos.map((demo, index) => (
              <button
                class={{
                  [classes.menuButton]: true,
                  [classes.menuSelected]: index === selected,
                }}
                onClick={() => (selectedRef.value = index)}
              >
                {demo.name}
              </button>
            ))}
          </div>
          <div class={classes.editorContainer}>
            <div class={classes.code}>
              <MonacoEditor
                class={classes.schemaEditor}
                code={demo.schemaCode}
                title="Schema"
                onChange={handleSchemaCodeChange}
              />
              <div class={classes.otherEditor}>
                <MonacoEditor
                  class={classes.uiSchemaEditor}
                  code={demo.uiSchemaCode}
                  title="UISchema"
                  onChange={handleUISchemaCodeChange}
                />
                <MonacoEditor
                  class={classes.valueEditor}
                  code={demo.dataCode}
                  title="Value"
                  onChange={handleDataCodeChange}
                />
              </div>
            </div>
            <div class={classes.component}>
              <SchemaForm
                schema={demo.schema}
                value={demo.data}
                onChange={(v: any) => {
                  console.log(v)
                }}
              ></SchemaForm>
            </div>
          </div>
        </div>
      )
    }
  },
})
