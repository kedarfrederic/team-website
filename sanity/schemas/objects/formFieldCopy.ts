import { defineType, defineField } from "sanity";

/**
 * Reusable copy block for a single form input.
 *
 * Holds only the user-facing editable bits — `label` and `placeholder`.
 * The technical attributes (the `name=` attribute the CRM relies on,
 * input type, validation rules) stay hardcoded in the Astro template
 * because changing them silently breaks the website-leads CRM
 * integration. Editors can rename "First name" to "Your given name"
 * without engineering involvement.
 *
 * Used by demoPage.formCopy.* and contactPage.formCopy.*. For dropdown
 * fields (role, artistCount), `placeholder` is the disabled-first-option
 * prompt (e.g. "Select your role").
 */
export const formFieldCopy = defineType({
  name: "formFieldCopy",
  title: "Form field copy",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Shown above the input.",
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder",
      type: "string",
      description:
        "Greyed-out hint inside the input. For dropdowns this is the disabled prompt option (e.g. \"Select your role\").",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "placeholder" },
  },
});
