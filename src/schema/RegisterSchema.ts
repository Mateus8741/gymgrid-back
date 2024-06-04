import { z } from "zod";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export { RegisterSchema };
