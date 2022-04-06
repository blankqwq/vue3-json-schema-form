import * as Monaco from 'monaco-editor'
import { createUseStyles } from 'vue-jss'
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  PropType,
  ref,
  shallowRef,
  watch,
} from 'vue'

const useStyle = createUseStyles({
  container: {
    border: '1px solid #ee',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 5,
  },
  title: {
    backgroundColor: '#eee',
    padding: '10px 0',
    paddingLeft: 20,
  },
  code: {
    flexGrow: 1,
  },
})

export default defineComponent({
  props: {
    code: {
      type: String as PropType<string>,
      required: true,
    },
    onChange: {
      type: Function as PropType<
        (value: string, event: Monaco.editor.IModelContentChangedEvent) => void
      >,
      required: true,
    },
    title: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const editorRef = shallowRef()
    const containerRef = ref()

    let _subscription: Monaco.IDisposable | undefined
    let _prevent_trigger_change_event = false
    onMounted(() => {
      const editor = (editorRef.value = Monaco.editor.create(
        containerRef.value,
        {
          value: props.code,
          language: 'json',
          formatOnPaste: true,
          tabSize: 2,
          minimap: {
            enabled: false,
          },
        },
      ))
      _subscription = editor.onDidChangeModelContent((e) => {
        console.log('---->', _prevent_trigger_change_event)
        if (!_prevent_trigger_change_event) {
          props.onChange(editor.getValue(), e)
        }
      })
    })

    onBeforeMount(() => {
      if (_subscription) {
        _subscription.dispose()
      }
    })
    watch(
      () => props.code,
      (v) => {
        const editor = editorRef.value
        const model = editor.getModel()
        if (v !== model.getValue()) {
          editor.pushUndoStop()
          _prevent_trigger_change_event = true
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: v,
              },
            ],
          )
          editor.pushUndoStop()
          _prevent_trigger_change_event = false
        }
      },
    )

    const classRef = useStyle()
    return () => {
      const classes = classRef.value
      return (
        <div class={classes.container}>
          <div class={classes.title}>
            <span>{props.title}</span>
          </div>
          <div class={classes.code} ref={containerRef} />
        </div>
      )
    }
  },
})
