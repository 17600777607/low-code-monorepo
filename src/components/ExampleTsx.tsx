import { defineComponent, ref } from 'vue'

/**
 * TSX 示例组件
 * 演示如何在 Vue 3 中使用 TSX
 */
export default defineComponent({
  name: 'ExampleTsx',
  props: {
    title: {
      type: String,
      default: 'TSX 组件示例',
    },
  },
  setup(props) {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    return () => (
      <div class="example-tsx">
        <h2>{props.title}</h2>
        <p>计数: {count.value}</p>
        <button onClick={increment}>增加</button>
      </div>
    )
  },
})
