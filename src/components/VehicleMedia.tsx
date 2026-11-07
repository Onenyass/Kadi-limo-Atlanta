import Image from "next/image";
import type { ImageAsset, VehicleCategory } from "@/content/types";
import { VehicleArt } from "./VehicleArt";

/**
 * Shows the CMS photo when one exists, otherwise a labelled illustration.
 * Representative (non-Kadi) photos always carry a visible label.
 */
export function VehicleMedia({
  image,
  category,
  name,
  variant = "card",
  priority = false,
  sizes = "(min-width: 1100px) 33vw, (min-width: 720px) 50vw, 90vw",
}: {
  image?: ImageAsset;
  category: VehicleCategory;
  name: string;
  variant?: "card" | "hero";
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`frame frame--${variant}`}>
      {image ? (
        <>
          <Image
            className="frame__photo"
            src={image.url}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
          />
          {image.isRepresentative && <span className="frame__label">Representative image</span>}
        </>
      ) : (
        <>
          <div className="frame__lines" aria-hidden="true" />
          <div className="frame__art">
            <VehicleArt category={category} title={`Illustration of a black ${name}`} />
          </div>
          <span className="frame__label">
            {variant === "hero" ? "Illustration · Photo coming soon" : "Illustration"}
          </span>
        </>
      )}
    </div>
  );
}
