import React from "react";

export default function AppsIcon(props: { color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className='icon-svg' fill={props.color || "black"}>
      <path d="M22 2l-10 10h-6l-6 8c0 0 6.357-1.77 10.065-0.94l-10.065 12.94 13.184-10.255c1.839 4.208-1.184 10.255-1.184 10.255l8-6v-6l10-10 2-10-10 2z"></path>
    </svg>
  )
}