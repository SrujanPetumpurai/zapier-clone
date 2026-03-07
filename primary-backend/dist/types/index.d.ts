import { z } from "zod";
export declare const SignupSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const SigninSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const ZapCreateSchema: z.ZodObject<{
    availableTriggerId: z.ZodString;
    triggerMetadata: z.ZodOptional<z.ZodAny>;
    actions: z.ZodArray<z.ZodObject<{
        availableActionId: z.ZodString;
        actionMetadata: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=index.d.ts.map