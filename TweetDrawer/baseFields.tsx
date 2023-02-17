import { Field } from "payload/dist/fields/config/types";

export const getBaseFields = (): Field[] => [
	{
		name: "url",
		label: "Tweet URL",
		type: "text",
		required: true,
	},
];
