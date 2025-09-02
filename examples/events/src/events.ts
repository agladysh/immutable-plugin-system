import {
  ImmutableEntityCollection,
  type ImmutableEntities,
} from '../../../dist/index.js';

export type EventURN = string;

export interface Event<T extends EventURN> {
  readonly name: T;
}

// Bivariant listener type to allow assigning narrower event handlers to
// broader unions (sufficient for this example module).
type _Bivariant<T> = { bivarianceHack: T }['bivarianceHack'];
export type EventListener<E extends Event<EventURN>> = _Bivariant<
  (event: E) => void
>;

export type Events<
  EventUnion extends Event<EventURN>,
  K extends EventUnion['name'] = EventUnion['name'],
> = Record<K, EventUnion>;

// Map each event name to its listener; value type is the union listener.
export type EventEntities<EventUnion extends Event<EventURN>> =
  ImmutableEntities<EventUnion['name'], EventListener<EventUnion>>;

export interface Emitter<EventUnion extends Event<EventURN>> {
  emit(event: EventUnion): boolean;
  on(listener: EventListener<EventUnion>): this;
}

function forEachEntry<K extends string, V>(
  obj: Readonly<Record<K, V>>,
  fn: (key: K, value: V) => void
): void {
  for (const key of Object.keys(obj) as K[]) {
    fn(key, obj[key]);
  }
}

/**
 * Heuristic check for an `ImmutableEntityCollection` of event listeners.
 *
 * Notes (example scope): This is intentionally lightweight runtime probing
 * used only for the example module. Real integrations should validate against
 * an explicit schema.
 */
function isListenerCollection<EventUnion extends Event<EventURN>>(
  value: unknown
): value is ImmutableEntityCollection<
  EventUnion['name'],
  EventListener<EventUnion>
> {
  if (!(value instanceof ImmutableEntityCollection)) {
    return false;
  }
  // Best-effort runtime probe: ensure iterator yields a function as first item
  const iter = (value as Iterable<unknown>)[Symbol.iterator]();
  const next = iter.next();
  if (next.done) {
    return true;
  } // empty collection is acceptable
  const first = next.value as unknown as [unknown, unknown, unknown];
  return typeof first?.[0] === 'function';
}

/**
 * Minimal shape check for an entities record mapping event names to listeners.
 *
 * Notes (example scope): This validates that all enumerable values are
 * functions; it is sufficient for the example. Prefer explicit schema in real
 * integrations.
 */
function isEventEntitiesRecord<EventUnion extends Event<EventURN>>(
  value: unknown
): value is EventEntities<EventUnion> {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  for (const [, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v !== 'function') {
      return false;
    }
  }
  return true;
}

export function emitterFromEntities<EventUnion extends Event<EventURN>>(
  entities:
    | EventEntities<EventUnion>
    | ImmutableEntityCollection<EventUnion['name'], EventListener<EventUnion>>
): Emitter<EventUnion> {
  const perEvent: Map<string, EventListener<EventUnion>[]> = new Map();
  const anyListeners: EventListener<EventUnion>[] = [];

  const add = (name: string, listener: EventListener<EventUnion>): void => {
    if (!perEvent.has(name)) {
      perEvent.set(name, []);
    }
    perEvent.get(name)!.push(listener);
  };

  if (isListenerCollection<EventUnion>(entities)) {
    for (const [listener, name] of entities) {
      add(String(name), listener);
    }
  } else if (isEventEntitiesRecord<EventUnion>(entities)) {
    forEachEntry(entities, (eventName, listener) => {
      add(eventName, listener);
    });
  }

  return {
    emit(event: EventUnion): boolean {
      const list = perEvent.get(event.name) ?? [];
      for (const l of list) {
        l(event);
      }
      for (const l of anyListeners) {
        l(event);
      }
      return list.length > 0 || anyListeners.length > 0;
    },

    on(listener: EventListener<EventUnion>): Emitter<EventUnion> {
      anyListeners.push(listener);
      return this;
    },
  };
}
