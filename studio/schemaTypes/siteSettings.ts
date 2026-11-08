import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "business", title: "Business details", default: true },
    { name: "home", title: "Home page" },
    { name: "about", title: "About page" },
    { name: "contact", title: "Contact & legal" },
  ],
  fields: [
    defineField({ name: "businessName", title: "Business name", type: "string", group: "business", initialValue: "Kadi Limo & Transportation" }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      group: "business",
      description: "Shown in the header menu, contact page, footer and search-engine data. Leave empty until confirmed.",
    }),
    defineField({
      name: "textEnabled",
      title: "Phone number accepts text messages",
      type: "boolean",
      group: "business",
      initialValue: false,
      description: "Turn on only if customers can text the phone number above. Shows a “Text” button.",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "business",
      description: "Only if Kadi uses WhatsApp for customer inquiries. Include the country code, e.g. +1 404 555 0100.",
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      group: "business",
      validation: (r) => r.email(),
      description: "Leave empty until confirmed.",
    }),
    defineField({
      name: "serviceArea",
      title: "Service area",
      type: "string",
      group: "business",
      description: "e.g. the cities/counties served. Leave empty until confirmed.",
    }),
    defineField({ name: "seoDescription", title: "Search description", type: "text", rows: 3, group: "business", validation: (r) => r.max(170) }),

    defineField({ name: "heroEyebrow", title: "Hero label", type: "string", group: "home" }),
    defineField({ name: "heroHeading", title: "Hero heading", type: "text", rows: 2, group: "home", description: "Use a line break to control where the heading wraps." }),
    defineField({ name: "heroIntro", title: "Hero intro", type: "text", rows: 3, group: "home" }),
    defineField({ name: "heroImage", title: "Hero image", type: "imageWithAlt", group: "home", description: "Optional. Wide, high-resolution photo of a black vehicle." }),
    defineField({ name: "introHeading", title: "Intro heading", type: "string", group: "home" }),
    defineField({ name: "introBody", title: "Intro paragraphs", type: "array", of: [defineArrayMember({ type: "text", rows: 3 })], group: "home" }),

    defineField({ name: "aboutHeading", title: "About label", type: "string", group: "about" }),
    defineField({ name: "aboutIntro", title: "About intro", type: "text", rows: 3, group: "about" }),
    defineField({ name: "aboutBody", title: "About paragraphs", type: "array", of: [defineArrayMember({ type: "text", rows: 4 })], group: "about" }),
    defineField({
      name: "principles",
      title: "How we work",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "principle",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "body", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),

    defineField({ name: "contactIntro", title: "Contact page intro", type: "text", rows: 3, group: "contact" }),
    defineField({
      name: "privacyPolicy",
      title: "Privacy policy",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      group: "contact",
      description: "One paragraph per item. Have this reviewed before publishing. The site shows a placeholder while empty.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
