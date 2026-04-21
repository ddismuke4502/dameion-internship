import React from "react";

const formatTimeLeft = (expiryDate, now) => {
  const end = new Date(expiryDate).getTime();

  if (Number.isNaN(end)) {
    return "";
  }

  const diff = end - now;

  if (diff <= 0) {
    return "Ended";
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};

const CountdownPill = ({ expiryDate, now, className = "" }) => {
  return (
    <div className={`de_countdown ${className}`.trim()}>
      {formatTimeLeft(expiryDate, now)}
    </div>
  );
};

export default CountdownPill;