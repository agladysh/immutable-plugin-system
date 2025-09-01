import { expectType, expectError } from 'tsd';
import type {
  ImmutableEntities,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
  ImmutableEntityCollection,
} from '..';
import { ImmutableHost } from '..';

// Real-world integration pattern inspired by examples/events/src/main.ts
type Command = (ctx: Context, ...args: string[]) => string;

class Context {
  print(text: string): void {
    console.log(text);
  }
}

// Event system types
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
type EventListener<E extends Events> = (event: E) => void;

// Complex entity structure with mixed key types
type ApplicationEntities = {
  assets: ImmutableEntities<string, string>;
  commands: ImmutableEntities<string, Command>;
  eventHandlers: ImmutableEntities<Events['name'], EventListener<Events>>;
  metadata: ImmutableEntities<symbol, { version: string; author: string }>;
  config: ImmutableEntities<string | symbol, {}>;
};

interface ApplicationPlugin extends ImmutablePlugin<ApplicationEntities> {
  description: string;
  version: string;
}

// Plugin A implementation
const pluginA: ApplicationPlugin = {
  name: 'plugin-a',
  description: 'Plugin A with assets and commands',
  version: '1.0.0',
  entities: {
    assets: {
      logo: 'logo.png',
      banner: 'banner.jpg',
      duplicate: 'duplicate-from-a',
    },
    commands: {
      greet: (ctx: Context, name: string) => {
        ctx.print(`Hello, ${name}!`);
        return `Greeted ${name}`;
      },
      info: (ctx: Context) => {
        ctx.print('Plugin A info');
        return 'info-result';
      },
    },
    eventHandlers: {
      beforeCommandExecution: ((event: Events) => {
        if (event.name === 'beforeCommandExecution') {
          event.ctx.print(`[A] Before: ${event.command}`);
        }
      }) as EventListener<Events>,
      afterCommandExecution: ((event: Events) => {
        if (event.name === 'afterCommandExecution') {
          event.ctx.print(`[A] After: ${event.command} -> ${event.result}`);
        }
      }) as EventListener<Events>,
    },
    metadata: {
      [Symbol.for('plugin-info')]: {
        version: '1.0.0',
        author: 'Plugin A Author',
      },
    },
    config: {
      enabled: true,
      logLevel: 'info',
      [Symbol('internal-config')]: { debug: false },
    },
  },
} as const;

// Plugin B implementation
const pluginB: ApplicationPlugin = {
  name: 'plugin-b',
  description: 'Plugin B with different assets and commands',
  version: '2.1.0',
  entities: {
    assets: {
      icon: 'icon.svg',
      duplicate: 'duplicate-from-b',
      theme: 'theme.css',
    },
    commands: {
      calculate: (ctx: Context, a: string, b: string) => {
        const result = Number(a) + Number(b);
        ctx.print(`${a} + ${b} = ${result}`);
        return result.toString();
      },
      status: (ctx: Context) => {
        ctx.print('Plugin B is active');
        return 'active';
      },
    },
    eventHandlers: {
      beforeCommandExecution: ((event: Events) => {
        if (event.name === 'beforeCommandExecution') {
          event.ctx.print(`[B] Starting: ${event.command}`);
        }
      }) as EventListener<Events>,
      afterCommandExecution: ((event: Events) => {
        if (event.name === 'afterCommandExecution') {
          event.ctx.print(`[B] Completed: ${event.command}`);
        }
      }) as EventListener<Events>,
    },
    metadata: {
      [Symbol.for('plugin-info')]: {
        version: '2.1.0',
        author: 'Plugin B Team',
      },
      [Symbol.for('build-info')]: {
        version: '2.1.0',
        author: 'Build System',
      },
    },
    config: {
      enabled: true,
      maxRetries: 3,
      [Symbol('performance')]: { cacheSize: 1000 },
    },
  },
} as const;

// Type validation for plugins
expectType<ApplicationPlugin>(pluginA);
expectType<ApplicationPlugin>(pluginB);

// Plugin collection
const applicationPlugins: ImmutablePlugins<ApplicationPlugin> = {
  'plugin-a': pluginA,
  'plugin-b': pluginB,
} as const;

// Host initialization
const applicationHost = new ImmutableHost(applicationPlugins, {
  requiredEntityTypes: ['assets', 'commands', 'eventHandlers'],
});

expectType<ImmutableHost<ApplicationPlugin>>(applicationHost);

// Entity collection type validation
expectType<ImmutableEntityCollection<string, string>>(
  applicationHost.entities.assets
);
expectType<ImmutableEntityCollection<string, Command>>(
  applicationHost.entities.commands
);
expectType<ImmutableEntityCollection<Events['name'], EventListener<Events>>>(
  applicationHost.entities.eventHandlers
);
expectType<
  ImmutableEntityCollection<symbol, { version: string; author: string }>
>(applicationHost.entities.metadata);
expectType<ImmutableEntityCollection<string | symbol, {}>>(
  applicationHost.entities.config
);

// Asset discovery across plugins with conflicts
const logoAssets = applicationHost.entities.assets.get('logo');
expectType<string[]>(logoAssets);

const duplicateAssets = applicationHost.entities.assets.get('duplicate');
expectType<string[]>(duplicateAssets);

// Command discovery and execution patterns
const greetCommands = applicationHost.entities.commands.get('greet');
expectType<Command[]>(greetCommands);

if (greetCommands.length > 0) {
  const greetCommand = greetCommands[0];
  expectType<Command>(greetCommand);

  const ctx = new Context();
  const result = greetCommand(ctx, 'World');
  expectType<string>(result);
}

// Event handler discovery
const beforeHandlers = applicationHost.entities.eventHandlers.get(
  'beforeCommandExecution'
);
expectType<EventListener<Events>[]>(beforeHandlers);

const afterHandlers = applicationHost.entities.eventHandlers.get(
  'afterCommandExecution'
);
expectType<EventListener<Events>[]>(afterHandlers);

// Metadata discovery with symbols
const pluginInfoEntries = applicationHost.entities.metadata.flat();
expectType<[{ version: string; author: string }, symbol, PluginURN][]>(
  pluginInfoEntries
);

// Config discovery with mixed keys
const configEntries = applicationHost.entities.config.flat();
expectType<[{}, string | symbol, PluginURN][]>(configEntries);

// Complex iteration patterns
for (const [asset, key, pluginURN] of applicationHost.entities.assets) {
  expectType<string>(asset);
  expectType<string>(key);
  expectType<PluginURN>(pluginURN);
}

for (const [command, key, pluginURN] of applicationHost.entities.commands) {
  expectType<Command>(command);
  expectType<string>(key);
  expectType<PluginURN>(pluginURN);
}

for (const [handler, eventName, pluginURN] of applicationHost.entities
  .eventHandlers) {
  expectType<EventListener<Events>>(handler);
  expectType<Events['name']>(eventName);
  expectType<PluginURN>(pluginURN);
}

// Entity transformation patterns
const assetSummary = applicationHost.entities.assets.map((assets, key) => ({
  key,
  count: assets.length,
  sources: `${assets.length} items`,
}));
expectType<{ key: string; count: number; sources: string }[]>(assetSummary);

const commandInventory = applicationHost.entities.commands.flatMap(
  (command, key, pluginURN) => ({
    command: key,
    plugin: pluginURN,
    function: command,
  })
);
expectType<{ command: string; plugin: PluginURN; function: Command }[]>(
  commandInventory
);

// Plugin-specific operations through host
for (const [pluginURN, plugin] of Object.entries(applicationHost.plugins)) {
  expectType<PluginURN>(pluginURN);
  expectType<ApplicationPlugin>(plugin);
  expectType<string>(plugin.description);
  expectType<string>(plugin.version);
}

// Optional entity type handling in complex scenarios
type PartialEntities = {
  required: ImmutableEntities<string, string>;
  optional1?: ImmutableEntities<string, number>;
  optional2?: ImmutableEntities<symbol, boolean>;
};

type PartialPlugin = ImmutablePlugin<PartialEntities>;

const partialPluginA: PartialPlugin = {
  name: 'partial-a',
  entities: {
    required: { key: 'value' },
    optional1: { num: 42 },
    // optional2 omitted
  },
} as const;

const partialPluginB: PartialPlugin = {
  name: 'partial-b',
  entities: {
    required: { key: 'value' },
    // optional1 omitted
    optional2: { [Symbol('test')]: true },
  },
} as const;

const partialPlugins: ImmutablePlugins<PartialPlugin> = {
  'partial-a': partialPluginA,
  'partial-b': partialPluginB,
} as const;

const partialHost = new ImmutableHost(partialPlugins);

// Required entity always available
expectType<ImmutableEntityCollection<string, string>>(
  partialHost.entities.required
);

// Optional entities handling - access directly without runtime checks for type tests
// These properties exist in the type even if they may be empty at runtime

// Multi-plugin entity conflict resolution patterns
const allAssets = applicationHost.entities.assets.flat();
const assetsByPlugin = new Map<PluginURN, string[]>();

for (const [asset, key, pluginURN] of allAssets) {
  const existing = assetsByPlugin.get(pluginURN) ?? [];
  existing.push(`${key}: ${asset}`);
  assetsByPlugin.set(pluginURN, existing);
}

// Command execution with event system integration
const executeCommand = (
  commandName: string,
  ...args: string[]
): string | undefined => {
  const commands = applicationHost.entities.commands.get(commandName);
  if (commands.length === 0) {
    return undefined;
  }

  // Use first command (no conflict resolution for demo)
  const command = commands[0];
  const ctx = new Context();

  // Trigger before events
  const beforeHandlers = applicationHost.entities.eventHandlers.get(
    'beforeCommandExecution'
  );
  beforeHandlers.forEach((handler) => {
    handler({ name: 'beforeCommandExecution', ctx, command: commandName });
  });

  // Execute command
  const result = command(ctx, ...args);

  // Trigger after events
  const afterHandlers = applicationHost.entities.eventHandlers.get(
    'afterCommandExecution'
  );
  afterHandlers.forEach((handler) => {
    handler({
      name: 'afterCommandExecution',
      ctx,
      command: commandName,
      result,
    });
  });

  return result;
};

expectType<string | undefined>(executeCommand('greet', 'World'));
expectType<string | undefined>(executeCommand('calculate', '2', '3'));
expectType<string | undefined>(executeCommand('nonexistent'));

// Complex entity queries
const findPluginsByAsset = (assetName: string): PluginURN[] => {
  return applicationHost.entities.assets
    .flat()
    .filter(([_, key]) => key === assetName)
    .map(([_, __, pluginURN]) => pluginURN);
};

expectType<PluginURN[]>(findPluginsByAsset('duplicate'));

// Type-safe entity transformation chains
const entityStatistics = {
  totalAssets: applicationHost.entities.assets.flat().length,
  totalCommands: applicationHost.entities.commands.flat().length,
  totalEventHandlers: applicationHost.entities.eventHandlers.flat().length,
  totalMetadata: applicationHost.entities.metadata.flat().length,
  totalConfig: applicationHost.entities.config.flat().length,
};

expectType<{
  totalAssets: number;
  totalCommands: number;
  totalEventHandlers: number;
  totalMetadata: number;
  totalConfig: number;
}>(entityStatistics);
