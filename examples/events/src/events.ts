import type { ImmutableEntities } from '../../../src/index.js';

export type EventURN = string;

export interface Event<T extends EventURN> {
  readonly name: T;
}

export type EventListener<E extends Event<EventURN>> = (event: E) => void;

export type Events<
  EventUnion extends Event<EventURN>,
  K extends EventUnion['name'] = EventUnion['name'],
> = Record<K, EventUnion>;

export type EventEntities<EventUnion extends Event<EventURN>> =
  ImmutableEntities<
    EventUnion['name'],
    { [E in EventUnion as E['name']]: EventListener<E> }
  >;

export interface Emitter<EventUnion extends Event<EventURN>> {
  emit(event: EventUnion): boolean;
  on<E extends EventUnion>(listener: EventListener<E>): this;
}

export function emitterFromEntities<EventUnion extends Event<EventURN>>(
  entities: EventEntities<EventUnion>
): Emitter<EventUnion> {
  const listeners: Map<string, EventListener<EventUnion>[]> = new Map();

  for (const [eventName, listener] of Object.entries(entities)) {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, []);
    }
    listeners.get(eventName)!.push(listener);
  }

  return {
    emit(event: EventUnion): boolean {
      const eventListeners = listeners.get(event.name);
      if (eventListeners) {
        for (const listener of eventListeners) {
          listener(event);
        }
        return true;
      }
      return false;
    },

    on<E extends EventUnion>(_listener: EventListener<E>): Emitter<EventUnion> {
      return this;
    },
  };
}
