"use client";
import React from "react";
import { useSession } from "../provider/session-provider";

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/session`, {
      credentials: "include",
      method: "GET",
    });
    return res.json();
  } catch (error) {
    return null;
  }
};

function Getdat() {
  const handleClick = async () => {
    const data = await getData();
    console.log({ user: data });
  };
  const sess = useSession();
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <h2>{sess.user.name}</h2>
      <pre>{JSON.stringify(sess.user, null, 2)}</pre>
    </div>
  );
}

export default Getdat;
