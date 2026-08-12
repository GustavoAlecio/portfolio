import Image from "next/image";
import type { MediaItem } from "@/content/schema";
import { cn } from "@/lib/cn";

/**
 * Adapter de mídia. A união discriminada garante exaustividade: um `kind` novo
 * quebra o build até ser tratado aqui, em vez de renderizar nada em produção.
 *
 * Vídeo do Screen Studio entra como mp4 com poster — nunca GIF: o mesmo clipe
 * de 5 s custa ~8 MB em GIF contra ~300 KB em mp4.
 */
export function MediaFrame({
  item,
  className,
  priority = false,
}: {
  item: MediaItem;
  className?: string;
  priority?: boolean;
}) {
  const frame = cn(
    "relative overflow-hidden rounded-card border border-line bg-recess shadow-e1",
    className,
  );

  switch (item.kind) {
    case "video":
      return (
        <figure className={frame} style={{ aspectRatio: item.aspect }}>
          <video
            className="h-full w-full object-cover"
            poster={item.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={item.alt}
          >
            <source src={item.src} type="video/mp4" />
          </video>
          {item.caption ? (
            <figcaption className="label absolute bottom-3 left-4 text-[10.5px]">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "image":
      return (
        <figure className={frame} style={{ aspectRatio: item.aspect }}>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority={priority}
            sizes="(max-width: 880px) 100vw, 50vw"
            className="object-cover"
          />
          {item.caption ? (
            <figcaption className="label absolute bottom-3 left-4 text-[10.5px]">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "shot":
      return (
        <figure className="grid gap-[9px]">
          <div className={cn(frame, "aspect-[4/3]")}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 880px) 100vw, 50vw"
              className="object-contain p-4"
            />
          </div>
          <figcaption className="label text-[10.5px]">{item.caption}</figcaption>
        </figure>
      );
  }
}
