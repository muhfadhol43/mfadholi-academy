"use client";

import YouTube from "react-youtube";

export function VideoPlayer({ youtubeId }: { youtubeId: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <YouTube
        videoId={youtubeId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: { modestbranding: 1, rel: 0 },
        }}
        className="h-full w-full"
        iframeClassName="h-full w-full"
      />
    </div>
  );
}
