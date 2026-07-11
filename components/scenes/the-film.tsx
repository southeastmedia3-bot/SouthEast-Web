import { ScrollVideo } from "@/components/media/scroll-video";
import { DisciplineMarquee } from "@/components/media/marquee";
import { disciplineTags, filmContent } from "@/data/home";
import { heroFilm } from "@/data/media";

/**
 * Scene 02 — The Film. The dark cinematic centerpiece: a pinned, scroll-scrubbed
 * sequence (the aadhyaanimatics-style "scroll video"). Drop a compressed loop
 * into the `heroFilm` manifest entry to activate true frame scrubbing.
 */
export function TheFilm() {
  return (
    <>
      <ScrollVideo
        eyebrow={filmContent.eyebrow}
        headline={filmContent.headline}
        sublines={filmContent.sublines}
        body={filmContent.body}
        primaryCta={filmContent.primaryCta}
        secondaryCta={filmContent.secondaryCta}
        video={heroFilm.video}
        poster={heroFilm.poster}
        tone="blue"
      />
      <DisciplineMarquee items={disciplineTags} />
    </>
  );
}
