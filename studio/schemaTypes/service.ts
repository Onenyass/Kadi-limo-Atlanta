import { defineArrayMember, defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      description: "Used in links such as /services#weddings and to preselect the form.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 2, description: "One sentence, shown on cards." }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "goodFor", title: "Good for", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "note", type: "string", description: "Optional caveat, e.g. availability." }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "featured", title: "Feature on home page", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Sort order", type: "number", description: "Lower numbers appear first." }),
  ],
  orderings: [{ title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});
