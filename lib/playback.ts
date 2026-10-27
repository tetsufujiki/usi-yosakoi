import { useEffect, useEffectEvent } from "react";

const playbackEvent = "usi:playback";

type PlaybackDetail = {
  sourceId: string;
};

/**
 * Every player on a page announces when the user starts a work so that all
 * other players close (or mute). This keeps a single work audible at a time.
 */
export function announcePlayback(sourceId: string) {
  window.dispatchEvent(
    new CustomEvent<PlaybackDetail>(playbackEvent, { detail: { sourceId } }),
  );
}

export function useExclusivePlayback(
  sourceId: string,
  onOtherPlayback: () => void,
) {
  const handleOtherPlayback = useEffectEvent(onOtherPlayback);

  useEffect(() => {
    function handlePlayback(event: Event) {
      const { detail } = event as CustomEvent<PlaybackDetail>;
      if (detail?.sourceId !== sourceId) handleOtherPlayback();
    }

    window.addEventListener(playbackEvent, handlePlayback);
    return () => window.removeEventListener(playbackEvent, handlePlayback);
  }, [sourceId]);
}
