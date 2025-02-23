import React from "react";
import minimist from "minimist";
import { faker } from "@faker-js/faker";

interface ConsoleState {
  user: string;
  system: string;
  cwd: string;
}

type ConsoleLine =
  | {
      command: true;
      commandLine: string;
      commandText: string;
    }
  | {
      command: false;
      text: string;
    };

interface CommandOptions<A> {
  args: A & minimist.ParsedArgs;
  consoleState: ConsoleState;
  setConsoleState: React.Dispatch<React.SetStateAction<ConsoleState>>;
  setLines: React.Dispatch<React.SetStateAction<ConsoleLine[]>>;
  appendLine: (line: ConsoleLine) => void;
  updateConsoleState: (state: Partial<ConsoleState>) => void;
}

interface ArgumentOptions extends minimist.Opts {
  positionals?: string[];
}

interface Command<A> {
  options: ArgumentOptions;
  execute: (options: CommandOptions<A>) => Promise<void> | void;
}

const COMMANDS = {
  ls: {
    options: {},
    execute: ({ appendLine }: CommandOptions<string[]>) => {
      const files = Array.from<unknown, [string, string]>(
        { length: Math.floor(Math.random() * 10) },
        () => {
          const filename = faker.system.fileName();
          const size = faker.number.int({ min: 1, max: 1000 }).toFixed();
          const sizeType = faker.helpers.weightedArrayElement([
            { value: "KB", weight: 10 },
            { value: "MB", weight: 5 },
            { value: "GB", weight: 1 },
          ]);

          return [filename, size + sizeType];
        }
      ).sort((a, b) => a[0].localeCompare(b[0]));

      const maxLength = Math.max(0, ...files.map((f) => f[0].length)) + 2;
      const maxSizeLength = Math.max(0, ...files.map((f) => f[1].length)) + 1;
      for (const [file, size] of files) {
        appendLine({
          command: false,
          text:
            "  " +
            file.padEnd(maxLength, ".") +
            size.padStart(maxSizeLength, "."),
        });
      }
    },
  },
  cd: {
    options: {
      positionals: ["<directory>"],
    },
    execute: ({ args, updateConsoleState }: CommandOptions<string[]>) => {
      updateConsoleState({ cwd: args._[0] });
    },
  },
  cls: {
    options: {},
    execute: ({ setLines }) => {
      setLines([]);
    },
  },
  help: {
    options: {},
    execute: ({ appendLine }) => {
      appendLine({
        command: false,
        text: Object.keys(COMMANDS).sort().join(" "),
      });
    },
  },
} satisfies Record<string, Command<never>>;

async function runCommand<A>(
  command: Command<A>,
  rawArgs: string[],
  commandOptions: Omit<CommandOptions<A>, "args">
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
): Promise<Partial<ConsoleState> | void> {
  const args = minimist<A>(rawArgs, {
    ...command.options,
    "--": true,
  });

  const positionals = command.options.positionals ?? [];

  if (args._.length < positionals.length) {
    const missingArgs = positionals.slice(args._.length);
    throw new Error(`missing arugments: ${missingArgs.join(", ")}`);
  } else if (args._.length > positionals.length) {
    const badArgs = args._.slice(positionals.length);
    throw new Error(`unexpected arguments: "${badArgs.join(" ")}"`);
  }

  await Promise.resolve(
    command.execute({
      ...commandOptions,
      args,
    })
  );
}

const ConsoleInner: React.FC = () => {
  const [consoleState, setConsoleState] = React.useState<ConsoleState>({
    user: "admin",
    system: "system",
    cwd: "~/",
  });

  const [lines, setLines] = React.useState<ConsoleLine[]>([]);
  const [input, setInput] = React.useState("");
  const [executing, setExecuting] = React.useState(false);

  const [commandLineElem, setCommandLineElem] =
    React.useState<HTMLSpanElement | null>(null);
  const [commandLineWidth, setCommandLineWidth] = React.useState(0);

  const inputElemRef = React.useRef<HTMLTextAreaElement | null>(null);

  const commandLine = `${consoleState.user}@${consoleState.system}:${consoleState.cwd}$`;

  React.useEffect(() => {
    if (!commandLineElem) {
      return;
    }

    const obs = new ResizeObserver(() => {
      setCommandLineWidth(commandLineElem.clientWidth);
    });
    obs.observe(commandLineElem);

    return () => {
      obs.disconnect();
    };
  }, [commandLineElem]);

  React.useEffect(() => {
    inputElemRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "auto",
    });
  }, [lines]);

  const appendLine = React.useCallback((line: ConsoleLine) => {
    setLines((oldLines) => [...oldLines, line]);
  }, []);

  const updateConsoleState = React.useCallback(
    (consoleState: Partial<ConsoleState>) => {
      setConsoleState((c) => ({
        ...c,
        ...consoleState,
      }));
    },
    []
  );

  async function onSubmit() {
    if (executing) {
      return;
    }

    try {
      const commandText = input.trim();

      setExecuting(true);
      appendLine({ command: true, commandLine, commandText });
      setInput("");

      if (!commandText) {
        return;
      }

      const [commandName, ...commandArgs] = commandText.split(/\s+/);
      const command = COMMANDS[commandName as keyof typeof COMMANDS];
      if (!command) {
        appendLine({
          command: false,
          text: `unknown command: '${commandName}'`,
        });
        return;
      }

      await runCommand(command, commandArgs, {
        consoleState,
        setConsoleState,
        setLines,
        updateConsoleState,
        appendLine,
      });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const message = e instanceof Error ? e.message : `${e}`;
      appendLine({ command: false, text: `error: ${message}` });
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        color: "var( --primary-color )",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        overflowY: "auto",
        cursor: "text",
      }}
      onClick={() => {
        inputElemRef.current?.focus();
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          {line.command ? (
            <>
              <span
                css={{
                  whiteSpace: "nowrap",
                }}
              >
                {line.commandLine}&nbsp;
              </span>
              <span>{line.commandText}</span>
            </>
          ) : (
            <span>{line.text}</span>
          )}
        </div>
      ))}
      <div
        css={{
          width: "100%",
          position: "relative",
        }}
      >
        <span
          ref={setCommandLineElem}
          css={{
            position: "absolute",
            top: 0,
            left: 0,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {commandLine}&nbsp;
        </span>
        <div
          data-value={input}
          css={{
            position: "relative",
            "&::after": {
              content: "attr( data-value ) ' '",
              visibility: "hidden",
              display: "block",
              textIndent: commandLineWidth,
            },
          }}
        >
          <textarea
            ref={inputElemRef}
            css={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: 0,
              margin: 0,
              resize: "none",
              border: "none",
              outline: "none",
              background: "none",
              appearance: "none",
              color: "inherit",
              textIndent: commandLineWidth,
            }}
            autoCapitalize="none"
            autoComplete="none"
            spellCheck={false}
            enterKeyHint="done"
            readOnly={executing}
            value={input}
            data-value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                await onSubmit();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsoleInner;
