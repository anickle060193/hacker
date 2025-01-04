import React from "react";
import { faker } from "@faker-js/faker";

import { useRandomInterval } from "../hooks/useRandomInterval";

import { assertNever } from "../utils";

interface Datum {
  id: string;
  text: string;
}

interface Props {
  speed?: "fast" | "normal";
  variant?: "chat" | "data";
}

const SPEEDS: Record<
  NonNullable<Props["speed"]>,
  [min: number, max: number]
> = {
  fast: [50, 100],
  normal: [50, 1000],
};

export const Console: React.FC<Props> = ({
  speed = "normal",
  variant = "chat",
}) => {
  const [data, setData] = React.useState<Datum[]>([]);

  const appendData = React.useCallback((message: string) => {
    setData((d) =>
      [...d, { id: crypto.randomUUID(), text: message }].slice(-100)
    );
  }, []);

  const [min, max] = SPEEDS[speed];
  useRandomInterval(true, min, max, () => {
    if (variant === "chat") {
      const user = faker.datatype.boolean()
        ? faker.internet.username()
        : faker.internet.ip();
      appendData(`${user}: ${faker.hacker.phrase()}`);
    } else if (variant === "data") {
      appendData(
        `${faker.internet.username()} at ${faker.internet.ipv4()} ${faker.hacker.ingverb()} ${faker.word.preposition()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`
      );
    } else {
      assertNever(variant);
    }
  });

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        fontSize: "0.5em",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        css={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          color: "var( --primary-color )",
        }}
      >
        {data.map((d) => (
          <div key={d.id} css={{ whiteSpace: "nowrap" }}>
            {d.text}
          </div>
        ))}
      </div>
    </div>
  );
};
