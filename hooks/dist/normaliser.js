export const triggerNormalizers = {
    "github_comment": (raw) => raw.comment,
    "github_push": (raw) => raw.commits?.[0],
    "github_pr": (raw) => raw.pull_request,
    "stripe_payment": (raw) => raw.data?.object,
    "gmail_received": (raw) => raw.message?.payload,
    "schedule": (raw) => raw,
};
//# sourceMappingURL=normaliser.js.map