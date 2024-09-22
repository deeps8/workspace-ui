"use client";
// import { cookies } from "next/headers";
import React from "react";

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/session`, {
      credentials: "include",
      method: "GET",
    });
    console.log({ res: await res.json() });
    return res.json();
  } catch (error) {
    console.log({ error });
    return null;
  }
};

function Getdat() {
  const handleClick = async () => {
    const data = await getData();
    console.log({ user: data });
  };
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

export default Getdat;
