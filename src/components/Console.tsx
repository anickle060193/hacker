import React from "react";

import { Cell } from "./Cell";

import { assertNever } from "../utils";
import {
  BlockchainNewBlockData,
  BlockchainNewTransactionData,
  WikimediaRecentChangeData,
} from "../utils/data_sources";

interface Datum {
  id: string;
  text: string;
}

interface Props {
  source?: "wikimedia" | "blockchain";
}

export const Console: React.FC<Props> = ({ source = "wikimedia" }) => {
  const [data, setData] = React.useState<Datum[]>([]);

  const appendData = React.useCallback((message: string) => {
    setData((d) =>
      [...d, { id: crypto.randomUUID(), text: message }].slice(-100)
    );
  }, []);

  React.useEffect(() => {
    if (source === "wikimedia") {
      const stream = new EventSource(
        "https://stream.wikimedia.org/v2/stream/mediawiki.recentchange"
      );

      stream.addEventListener("open", () =>
        appendData("Opened Wikimedia data source stream.")
      );
      stream.addEventListener("error", () =>
        appendData("An error occurred with the Wikimedia data source stream.")
      );

      stream.addEventListener("message", (e: MessageEvent<string>) => {
        const data = JSON.parse(e.data) as WikimediaRecentChangeData;
        if (data.wiki === "enwiki") {
          appendData(
            [
              data.title,
              data.type,
              "by",
              data.user,
              ":",
              data.comment ?? "[no comment] ",
            ].join(" ")
          );
        }
      });

      return () => {
        stream.close();
      };
    } else if (source === "blockchain") {
      const ws = new WebSocket("wss://ws.blockchain.info/inv");

      ws.addEventListener("open", () => {
        appendData("Blockchain data source opened.");

        ws.send(JSON.stringify({ op: "unconfirmed_sub" }));
      });
      ws.addEventListener("close", () =>
        appendData("Blockchain data source closed.")
      );
      ws.addEventListener("error", () =>
        appendData("An error occurred with the Blockchain data source.")
      );
      ws.addEventListener("message", (e: MessageEvent<string>) => {
        const data = JSON.parse(e.data) as
          | BlockchainNewBlockData
          | BlockchainNewTransactionData;
        if (data.op === "block") {
          appendData(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${data.x.estimatedBTCSent}/${data.x.totalBTCSent} sent at ${data.x.time}: ${data.x.prevBlockIndex} -> ${data.x.blockIndex}`
          );
        } else if (data.op === "utx") {
          appendData(
            data.x.inputs
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              .map((i) => `${i.prev_out.tx_index}=${i.prev_out.value}`)
              .join("+") +
              " => " +
              data.x.out.map((o) => o.addr).join("-")
          );
        } else {
          assertNever(data);
        }
      });

      return () => {
        ws.close();
      };
    } else {
      assertNever(source);
    }
  }, [source, appendData]);

  return (
    <Cell>
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
          }}
        >
          {data.map((d) => (
            <div key={d.id} css={{ whiteSpace: "nowrap" }}>
              {d.text}
            </div>
          ))}
        </div>
      </div>
    </Cell>
  );
};
