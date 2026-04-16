import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),

		}),
});

const terminal = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/terminal', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),

			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			typingSpeed: z.int(),
			// Terminal choices
			terminalChoices: z
				.array(
					z.object({
						label: z.string(),
						target: z.string(),
					})
				)
				.optional(),
		}),
});

const photos = defineCollection({
	// Load Markdown and MDX files in the `src/content/places` directory.
	loader: glob({ base: './src/content/photos', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			createdDate: z.coerce.date().optional(),

			background: z.string().optional(),
			textColor: z.string().optional(),

			// Metadata mapped to EXIF, comments are copied and pasted from existing EXIF and serve as a model to model to.
			// LEICA CAMERA AG
			make: z.string().optional(),
			// LEICA TL2
			model: z.string().optional(),
			// Horizontal (normal), I am pretty sure EXIF is a dutch invention (Doe maar normaal). 
			orientation: z.string().optional(),
			meteringMode: z.string().optional(),

			//ExposureTime
			exposureTime: z.string().regex(/^\d+\/\d+$/).optional(),
			exposureCompensation: z.number().optional(),
			exposureProgram: z.string().optional(),

			// FNumber
			maxApertureValue: z.number().optional(),
			fNumber: z.number().optional(),

			// I am never really intrested by ISO, it sets the limits of your artistic freedom but feel arbitary. 
			// However for the sake of implementing and to avoid the innevitable comment it is missing here it is by popular demand.
			// You get to know how many noise I edited out!!!! 🥳
			iso: z.number().optional(),

			// Lenses this is where it is at!
			// 35mm f/2.8
			lensInfo: z.string().optional(),

			// LEICA CAMERA AG
			lensMake: z.string().optional(),
			// N/A
			lensModel: z.string().optional(),

			focalLengthIn35mmFormat: z.string().optional(),
			focalLength: z.string().optional(),

			// location GPS
			location: z.array(z.string()).max(1),
			// Location name
			locationName: z.string().optional(),

			// Images for map.
			thumbnail: z.string().optional(),
			preview: z.string().optional(),

		}),
});

export const collections = { blog, terminal, photos };
