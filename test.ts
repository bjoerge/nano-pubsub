import {test} from 'tap'
import PubSub from './src/index.ts'

test('it receives messages', (t) => {
  const events = PubSub<string>()
  events.subscribe((value) => {
    t.equal(value, 'hello')
    t.end()
  })
  events.publish('hello')
})

test('it does not receive messages after unsubscribe', (t) => {
  const events = PubSub<string>()
  const unsubscribe = events.subscribe(() => {
    t.fail('Did not expect to be called')
  })
  unsubscribe()
  events.publish('hello')
  t.end()
})

test('subscribers are called with arguments passed to publish', (t) => {
  const events = PubSub<[string, string, string]>()

  events.subscribe(([arg1, arg2, arg3]) => {
    t.equal(arg1, 'hello')
    t.equal(arg2, 'there')
    t.equal(arg3, 'planet')
    t.end()
  })
  events.publish(['hello', 'there', 'planet'])
})

test('identical subscribers can be added and unsubscribed', (t) => {
  const events = PubSub()

  let callCount = 0
  const subscriber = () => {
    callCount++
  }

  events.subscribe(subscriber)
  const unsubscribe = events.subscribe(subscriber)
  events.subscribe(subscriber)

  unsubscribe()

  events.publish()
  t.equal(callCount, 2)
  t.end()
})

test('allows for subscribing and unsubscribing in any order', (t) => {
  const events = PubSub<{}>()

  const unsubscribe1 = events.subscribe(() => {
    t.fail('Did not expect to be called')
  })
  const unsubscribe2 = events.subscribe(() => {
    t.fail('Did not expect to be called')
  })
  const unsubscribe3 = events.subscribe(() => {
    t.fail('Did not expect to be called')
  })

  // unsubscribe and subscribe out of order
  unsubscribe1()
  unsubscribe2()

  const unsubscribe4 = events.subscribe(() => {
    t.fail('Did not expect to be called')
  })

  unsubscribe3()
  unsubscribe4()

  // nothing should be called
  events.publish({})

  t.end()
})
