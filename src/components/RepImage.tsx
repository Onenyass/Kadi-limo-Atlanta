import Image from "next/image";
import type { ImageAsset, VehicleCategory } from "@/content/types";
import { Parallax } from "./Parallax";
import { VehicleArt } from "./VehicleArt";

/**
 * Vehicle imagery. Representative (non-Kadi) photos always carry a visible
 * "Representative image" label. Falls back to a labelled illustration when
 * no image exists (e.g. a new CMS entry without a photo).
 * Must be placed inside a position:relative, overflow:hidden container.
 */
export function RepImage({
  image,
  category,
  name,
  sizes,
  priority = false,
  parallax = false,
  label = "tl",
}: {
  image?: ImageAsset;
  category: VehicleCategory;
  name: string;
  sizes: string;
  priority?: boolean;
  parallax?: boolean;
  label?: "tl" | "tr" | "none";
}) {
  if (!image) {
    return (
      <>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "8%" }}>
          <VehicleArt category={category} title={`Illustration of a black ${name}`} />
        </div>
        {label !== "none" && <span className={`rep-label rep-label--${label}`}>Illustration</span>}
      </>
    );
  }
  const img = (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectFit: "cover" }}
    />
  );
  return (
    <>
      {parallax ? <Parallax>{img}</Parallax> : img}
      {image.isRepresentative && label !== "none" && (
        <span className={`rep-label rep-label--${label}`}>Representative image</span>
      )}
    </>
  );
}
