import { defineEnv } from "envin";
import { z } from "zod";

const env = defineEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_API_URL: z.url(),
	},
	env: import.meta.env,
});

export default env;
