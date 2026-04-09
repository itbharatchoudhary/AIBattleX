import User from "../models/user.model.js";
import Usage from "../models/usage.model.js";

export const plansData = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["5 uses per month", "Basic AI models", "Standard response time"]
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    features: ["Unlimited uses", "Priority processing", "Advanced AI models", "Faster responses"]
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    features: ["Everything in Pro", "Custom AI training", "API access", "24/7 support"]
  }
];

export const getPlans = (req: any, res: any) => {
  res.json(plansData);
};

export const upgradePlan = async (req: any, res: any) => {
  const { planId } = req.body;

  const user: any = await User.findById(req.user.id);
  const usage: any = await Usage.findOne({ userId: req.user.id });

  user.plan = planId;
  usage.used = 0;

  await user.save();
  await usage.save();

  res.json({ success: true });
};