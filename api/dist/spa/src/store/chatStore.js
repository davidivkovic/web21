import { reactive, ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import { getAccessToken } from '/src/api/http.js'
import router from '/src/router/index.js'
import {
  hasNotification,
  isAuthenticated,
  user as currentUser,
} from '/src/store/userStore.js'
const url = `ws://${window.location.hostname}:8080/chat`
const ws = new WebSocket(url + `?token=${getAccessToken()}`)
const conversations = reactive([])
const currentConversation = ref({})
const unreadCount = ref(0)
const messageSound = new Audio('/src/assets/sounds/new-message.wav')
const messageType = {
  textMessage: 0,
  seenPointer: 1,
  notification: 2,
}

const connectToChat = () => {
  console.log('Connecting to WS chat at: ' + url)
}

const clearConversations = () => (conversations.length = 0)

const insert = conversation => {
  if (conversation) {
    const index = conversations.findIndex(c => c.id == conversation.id)

    if (index == -1) {
      conversations.unshift(conversation)
      return conversations.at(0)
    }

    return conversations.at(index)
  }

  return null
}

const setcurrentConversation = conversation => {
  router.push(`/direct/t/${conversation.id}`)
  currentConversation.value = conversation

  if (conversation.messages.at(0)?.senderId != conversation.sender.id) {
    if (conversation.hasUnread) unreadCount.value--
    conversation.messages.at(0)?.id &&
    seen(conversation.id, conversation.messages.at(0).id)
  }
}

const getConversations = async () => {
  const [allConversations] = await api.conversations.get()

  if (allConversations) {
    clearConversations()
    conversations.push(...allConversations)
    unreadCount.value = conversations.filter(c => c.hasUnread).length
  }
}

const getConversation = async id => {
  const [conversation] = await api.conversations.getById(id)
  return insert(conversation)
}

const invite = async username => {
  const [conversation] = await api.conversations.invite(username)
  return insert(conversation)
}

const fetchMessages = async () => {
  const [messages] = await api.conversations.messagesBefore(
    currentConversation.value.id,
    currentConversation.value.messages.at(-1)?.sentAt
  )

  if (messages) {
    currentConversation.value.messages.push(...messages)
    return messages.length > 0
  }

  return false
}

const sendMessage = (conversationId, message) => {
  ws.send(
    JSON.stringify({
      conversationId: conversationId,
      type: messageType.textMessage,
      content: message,
    })
  )
  conversations
    .find(c => c.id == conversationId)
    ?.messages.unshift({
      conversationId: conversationId,
      senderId: currentUser.id,
      sentAt: new Date().toISOString(),
      content: message,
    })
}

const seen = (conversationId, messageId) => {
  ws.send(
    JSON.stringify({
      conversationId: conversationId,
      type: messageType.seenPointer,
      content: messageId,
    })
  )
  const conversation = conversations.find(c => c.id == conversationId)
  conversation && (conversation.hasUnread = false)
}

ws.onmessage = async e => {
  const message = JSON.parse(e.data)
  console.log(message)

  if (message.type == messageType.notification) {
    hasNotification.value = true
    return
  }

  let conversation = conversations.find(c => c.id == message.conversationId)

  if (conversation == undefined) {
    const [data] = await api.conversations.get()

    if (data) {
      conversation = data.find(c => c.id == message.conversationId)
      conversation && conversations.unshift(conversation)
      if (conversation.hasUnread) unreadCount.value++
    }
  }

  if (message.type == messageType.textMessage) {
    messageSound.play()
    conversation?.messages.unshift(message)

    if (currentConversation.value?.id == message.conversationId) {
      seen(message.conversationId, message.id)
    } else {
      if (!conversation.hasUnread) unreadCount.value++
      conversation.hasUnread = true
    }
  } else if (message.type == messageType.seenPointer) {
    conversation && (conversation.seenPointer = message.content)
  }
}

if (isAuthenticated.value) {
  const [count] = await api.conversations.unreadCount()
  count && (unreadCount.value = count)
}

export {
  connectToChat,
  conversations,
  currentConversation,
  setcurrentConversation,
  getConversation,
  getConversations,
  clearConversations,
  sendMessage,
  invite,
  fetchMessages,
  unreadCount,
}
