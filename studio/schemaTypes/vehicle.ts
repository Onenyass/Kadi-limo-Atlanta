import { defineArrayMember, defineField, defineType } from "sanity";

export const vehicle = defineType({
  name: "vehicle",
  title: "Vehicle",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      type: "string",
      description: "Chooses the placeholder illustration when no photo is set.",
      options: {
        list: [
          { title: "SUV", value: "suv" },
          { title: "Sedan", value: "sedan" },
          { title: "Limousine", value: "limousine" },
          { title: "Luxury", value: "luxury" },
        ],
        layout: "radio",
      },
      initialValue: "suv",
      validation: (r) => r.required(),
    }),
    defineField({ name: "kind", title: "Type label", type: "string", description: "e.g. “Full-size SUV”." }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "confirmedDetails",
      title: "Confirmed details",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description:
        "Only facts you have confirmed for this vehicle, e.g. “Seats up to 6”. Leave empty if unsure — nothing is shown when empty.",
    }),
    defineField({
      name: "suitedTo",
      title: "Suited to (services)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      description: "Services this vehicle suits. Shown on the Fleet page as suggested uses, not as availability.",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "imageWithAlt",
      description: "Landscape, about 4:3. Ideally shows the vehicle in use (arriving at a hotel, airport or event).",
    }),
    defineField({ name: "featured", title: "Feature on home page", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Sort order", type: "number" }),
  ],
  orderings: [{ title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "kind", media: "image" } },
});
