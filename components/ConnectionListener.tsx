import React, { useEffect, useState } from "react";
import { useNetworkContext } from "../context/NetworkContext";
import * as Sentry from "@sentry/nextjs";

export default function ConnectionListener() {
  const networkContext = useNetworkContext();
  const { offlineModeEnabled, hasNetworkConnection, mbps } = networkContext.state;
  const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg"; // test request image
  const downloadSize = 5452595; //size of photo in bytes
  const [browserHasFocus, setBrowserHasFocus] = useState<boolean>(true);

  useEffect(() => {
    window.addEventListener("offline", e => {
      console.log(`NETWORK STATUS CHANGE: OFFLINE`);
      networkContext.dispatch({
        type: "update network connection status",
        payload: {
          ...networkContext.state,
          hasNetworkConnection: false,
        },
      });
    });

    window.addEventListener("online", e => {
      console.log(`NETWORK STATUS CHANGE: ONLINE`);
      networkContext.dispatch({
        type: "update network connection status",
        payload: {
          ...networkContext.state,
          hasNetworkConnection: true,
        },
      });
    });

    document.addEventListener("visibilitychange", () => {
      const browserTabHidden = document.hidden;
      setBrowserHasFocus(!browserTabHidden);
    });
  }, []);

  useEffect(() => {
    const connectionPing = setInterval(() => {
      if (hasNetworkConnection && browserHasFocus) measureConnectionSpeed(hasNetworkConnection);
      if (mbps < 10) {
        networkContext.dispatch({
          type: "update offline mode enabled",
          payload: {
            ...networkContext.state,
            offlineModeEnabled: true,
          },
        });
      }
    }, 30000);
    return () => clearInterval(connectionPing);
  }, [hasNetworkConnection, offlineModeEnabled, browserHasFocus]);

  useEffect(() => {
    networkContext.dispatch({
      type: "update offline mode enabled",
      payload: {
        ...networkContext.state,
        offlineModeEnabled: mbps < 10 ? true : offlineModeEnabled,
      },
    });
  }, [hasNetworkConnection]);

  function measureConnectionSpeed(isOnline: boolean) {
    if (!isOnline) return;
    let startTime: number, endTime: number;
    const download = new Image();
    download.onload = () => {
      endTime = new Date().getTime();
      showResults();
    };

    download.onerror = () => {
      Sentry.captureMessage("Invalid image, or error downloading");
    };

    startTime = new Date().getTime();
    const cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = downloadSize * 8;
      const speedBps = bitsLoaded / duration;
      const speedKbps = speedBps / 1024;
      const speedMbps = Math.floor(speedKbps / 1024);
      networkContext.dispatch({
        type: "update mbps",
        payload: {
          ...networkContext.state,
          mbps: speedMbps,
        },
      });
    }
  }
  return <></>;
}
