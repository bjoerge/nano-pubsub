function randomId(len = 8): string {
  if (len <= 0) return ''
  return Math.floor(Math.random() * 16).toString(16) + randomId(len - 1)
}

export interface Subscriber<Event> {
  (event: Event): void
}
export interface PubSub<Message> {
  publish: (message: Message) => void
  subscribe: (subscriber: Subscriber<Message>) => () => void
}

export default function createPubSub<Message = void>(): PubSub<Message> {
  const subscribers = new Map<string, Subscriber<Message>>()

  function subscribe(subscriber: Subscriber<Message>) {
    const id = randomId()
    subscribers.set(id, subscriber)

    return function unsubscribe() {
      subscribers.delete(id)
    }
  }

  function publish(event: Message) {
    for (const subscriber of Array.from(subscribers.values())) {
      subscriber(event)
    }
  }

  return {
    publish,
    subscribe,
  }
}
