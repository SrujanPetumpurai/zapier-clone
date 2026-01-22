import { z } from 'zod';
export const SignupSchema = z.object({
    email: z.string().min(5),
    password: z.string().min(6),
    name: z.string().min(3)
});
export const SigninSchema = z.object({
    email: z.string(),
    password: z.string(),
    name: z.string()
});
export const ZapSchema = z.object({
    name: z.string(),
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional(),
    }))
});
//# sourceMappingURL=index.js.map