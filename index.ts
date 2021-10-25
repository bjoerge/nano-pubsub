export interface Subscriber<Event> {
  (event: Event): void
}
export interface PubSub<Message> {
  publish: (message: Message) => void
  subscribe: (subscriber: Subscriber<Message>) => () => void
}

export default function createPubSub<Message = void>(): PubSub<Message> {
  const subscribers = new Map<unknown, Subscriber<Message>>()

  function subscribe(subscriber: Subscriber<Message>) {
    const symbol = Symbol('SubscriberSymbol')
    subscribers.set(symbol, subscriber)

    return function unsubscribe() {
      subscribers.delete(symbol)
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
