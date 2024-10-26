export function getPlan(planId: string) {
  if (planId.includes("pro_")) {
    return "pro";
  } else if (planId.includes("premiumPlus_")) {
    return "premiumplus";
  } else if (planId.includes("premium_")) {
    return "premium";
  } else {
    return "free";
  }
}
