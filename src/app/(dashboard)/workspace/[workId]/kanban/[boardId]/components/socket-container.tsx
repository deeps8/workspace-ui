"use client";

import { SessionContext } from "@/components/provider/session-provider";
import { BoardState } from "@/types/board";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type SocketContextType = {
  ws: React.MutableRefObject<WebSocket | undefined>;
  data: BoardState;
  setData: React.Dispatch<React.SetStateAction<BoardState>>;
};
export const SocketContext = createContext<SocketContextType>({} as SocketContextType);

type SocketProviderType = {
  children: React.ReactNode;
  boardid: string;
};

function getBasicData() {
  return { columnMap: {}, orderedColumnIds: [] };
}

const SocketProvider: React.FC<SocketProviderType> = ({ children, boardid }) => {
  const ws = useRef<WebSocket>();
  const [data, setData] = useState<BoardState>(() => {
    const base = getBasicData();
    return { ...base, lastOperation: null };
  });
  const sess = useContext(SessionContext);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    // If you want to display a confirmation dialog, set the returnValue
    console.log("Exiting the page");
    event.preventDefault();
  };

  useEffect(() => {
    if (ws.current && ws.current.readyState === ws.current.OPEN) return;
    if (window && window["WebSocket"]) {
      const url = new URL(process.env.NEXT_PUBLIC_API_BASE_PATH || "");
      ws.current = new WebSocket(`ws://${url.host}/api/ws?roomid=${boardid}&userid=${sess?.user.id ?? ""}`);
      ws.current.onopen = function (e) {
        console.log("Connection Opened");
      };

      ws.current.onclose = function (e) {
        console.log("Connection Closed");
      };

      ws.current.onmessage = function (e) {
        console.log("Msg received", { data: e.data });
        try {
          if (e.data === null) return;
          const res = JSON.parse(e.data);
          if (res.type !== "msg") return;
          // send by me, do not update the state.
          // if (res.clientID === sess?.user.id) return;
          const brdData = JSON.parse(res.text) as BoardState;
          setData({ ...brdData });
        } catch (error) {
          console.log(error);
        }
      };

      ws.current.onerror = function (this, e) {
        console.log("Connection Error", this);
      };
    }
    // window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      console.log("Exit");
      if (!ws.current) return;
      if (ws.current.readyState === ws.current.OPEN) {
        ws.current.send("con-closed");
      }
      ws.current.close();
    };
  }, []);

  return <SocketContext.Provider value={{ data, setData, ws }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
