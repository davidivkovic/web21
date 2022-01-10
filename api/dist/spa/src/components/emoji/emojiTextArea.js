import { ref } from '/modules/vue.js'

export function useEmojiTextArea(textArea) {
  const text = ref('')
  const emojiSelected = emoji => {
    let position = textArea.value.selectionStart
    text.value =
      text.value.slice(0, position) + emoji + text.value.slice(position)
    textArea.value.focus()
    textArea.value.selectionStart = position + 2
  }

  return { emojiSelected, text }
}
