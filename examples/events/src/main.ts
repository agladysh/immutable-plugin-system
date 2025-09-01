import { ImmutableHost } from '../../../dist/index.js';
import type {
  ImmutablePlugin,
  ImmutablePlugins,
  ImmutableEntities,
} from '../../../dist/index.js';
import type { Emitter, EventEntities } from './events.js';
import { emitterFromEntities } from './events.js';

class Context {
  emitter: Emitter<Events>;
  constructor(emitter: Emitter<Events>) {
    this.emitter = emitter;
  }
  print(text: string): void {
    globalThis.process.stdout.write(`${text}\n`);
  }
}

type Command = (ctx: Context, ...args: string[]) => string;

type Entities = {
  assets: ImmutableEntities<string, string>;
  commands: ImmutableEntities<string, Command>;
  on: EventEntities<Events>;
};

type BeforeCommandExecution = {
  name: 'beforeCommandExecution';
  ctx: Context;
  command: string;
};

type AfterCommandExecution = {
  name: 'afterCommandExecution';
  ctx: Context;
  command: string;
  result: string;
};

type Events = BeforeCommandExecution | AfterCommandExecution;

interface Plugin extends ImmutablePlugin<Entities> {
  description: string;
}

const pluginA: Plugin = {
  name: 'pluginA',
  description: 'this is plugin A',
  entities: {
    on: {
      beforeCommandExecution: (e: Events) => {
        if (e.name === 'beforeCommandExecution') {
          e.ctx.print(
            `[pluginA] beforeCommandExecution command: "${e.command}"`
          );
        }
      },
      afterCommandExecution: (e: Events) => {
        if (e.name === 'afterCommandExecution') {
          e.ctx.print(
            `[pluginA] afterCommandExecution command: "${e.command}" result: "${e.result}"`
          );
        }
      },
    },
    assets: {
      foo: 'this is `foo`',
      duplicate: 'this is duplicate asset from PluginA',
    },
    commands: {
      bar: (ctx: Context, ...args: string[]): string => {
        ctx.print(`this is bar(${args.join(', ')})`);
        return '`bar` return value';
      },
    },
  },
};

class PluginB implements Plugin {
  readonly name: string;
  readonly description: string;
  readonly entities: Entities;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.entities = {
      on: {
        beforeCommandExecution: (e: Events) => {
          if (e.name === 'beforeCommandExecution') {
            e.ctx.print(
              `[pluginB] beforeCommandExecution command: "${e.command}"`
            );
          }
        },
        afterCommandExecution: (e: Events) => {
          if (e.name === 'afterCommandExecution') {
            e.ctx.print(
              `[pluginB] afterCommandExecution command: "${e.command}" result: "${e.result}"`
            );
          }
        },
      },
      assets: {
        baz: 'this is `baz`',
        duplicate: 'this is duplicate asset from PluginB',
      },
      commands: {
        quo: (ctx: Context, ...args: string[]): string => {
          ctx.print(`this is quo(${args.join(', ')})`);
          return '`quo` return value';
        },
      },
    };
  }
}

const pluginB = new PluginB('pluginB', 'this is plugin B');

class Host extends ImmutableHost<Plugin> {
  context: Context;

  constructor(plugins: ImmutablePlugins<Plugin>) {
    super(plugins);
    this.context = new Context(emitterFromEntities<Events>(this.entities.on));
    // Verify commands are unique on load
    for (const [name, items] of this.entities.commands.entries()) {
      if (items.length !== 1) {
        throw new Error(
          `duplicate commands "${name}" found: ${JSON.stringify(items)}`
        );
      }
    }
  }

  assets(name: string): string[] {
    return this.entities.assets.get(name);
  }

  run(name: string, ...args: string[]): string {
    // We know commands are unique
    const [command] = this.entities.commands.get(name);
    if (!command) {
      throw new Error(`unknown command "${name}"`);
    }

    this.context.emitter.emit({
      name: 'beforeCommandExecution',
      ctx: this.context,
      command: name,
    });

    const result = command(this.context, ...args);

    this.context.emitter.emit({
      name: 'afterCommandExecution',
      ctx: this.context,
      command: name,
      result,
    });

    return result;
  }
}

const host = new Host({ pluginA, pluginB });

const ctx = host.context;

ctx.emitter.on((e: Events) => {
  if (e.name === 'beforeCommandExecution') {
    e.ctx.print(`[main] beforeCommandExecution: "${e.command}"`);
  }
});

ctx.emitter.on((e: Events) => {
  if (e.name === 'afterCommandExecution') {
    e.ctx.print(
      `[main] afterCommandExecution: "${e.command}" result: "${e.result}"`
    );
  }
});

ctx.print('Available plugins:');
for (const [name, plugin] of Object.entries(host.plugins) as Array<
  [string, Plugin]
>) {
  ctx.print(`- ${name}: ${plugin.description}`);
}

ctx.print(`PluginA name: ${host.plugins['pluginA'].name}`);

ctx.print('Available assets:');
for (const [value, uri, plugin_name] of host.entities.assets) {
  // Prints both duplicates
  ctx.print(`- ${uri} [${plugin_name}]: "${value}"`);
}

ctx.print(`Assets "duplicate": "${host.assets('duplicate').join('", "')}"`);

ctx.print('Available commands:');
for (const [_command, name, plugin_name] of host.entities.commands) {
  ctx.print(`- ${name} [${plugin_name}]: ${host.run(name, 'hello')}`);
}

// Triggers events
ctx.print(`Running "bar": ${host.run('bar', 'world')}`);
