import { useEffect, useState } from "react";

const useCallTimer = (isRunning: boolean) => {
    const [elapsedSeconds, setElapsedSeconds] =
        useState(0);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const interval = setInterval(() => {
            setElapsedSeconds(
                previous => previous + 1,
            );
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [isRunning]);

    const hours = Math.floor(
        elapsedSeconds / 3600,
    );

    const minutes = Math.floor(
        (elapsedSeconds % 3600) / 60,
    );

    const seconds =
        elapsedSeconds % 60;

    const formattedTime =
        hours > 0
            ? `${hours
                .toString()
                .padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`
            : `${minutes
                .toString()
                .padStart(2, "0")}:${seconds
                    .toString()
                    .padStart(2, "0")}`;

    return {
        elapsedSeconds,
        formattedTime,
    };
};

export default useCallTimer;