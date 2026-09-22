import { defineEnv } from "envin";
import { z } from "zod";

const env = defineEnv({
	shared: {
		NODE_ENV: z.enum(["development", "production"]).default("development"),
	},
	clientPrefix: "VITE_",
	client: {
		VITE_API_URL: z.url(),
	},
	env: import.meta.env,
});

export default env;
