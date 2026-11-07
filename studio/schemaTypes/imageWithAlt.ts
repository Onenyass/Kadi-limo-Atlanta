import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers, e.g. “Black Cadillac Escalade parked outside a hotel entrance”.",
      validation: (r) => r.required().warning("Alt text helps accessibility and search."),
    }),
    defineField({
      name: "isRepresentative",
      title: "Representative image (not Kadi’s own vehicle)",
      type: "boolean",
      description:
        "Leave ON for stock or licensed photos. Turn OFF only for photos of Kadi’s actual vehicles. When on, the site shows a “Representative image” label.",
      initialValue: true,
    }),
  ],
});
