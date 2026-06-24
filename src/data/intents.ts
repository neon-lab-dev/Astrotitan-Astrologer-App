import { IconName } from "../assets/svg";


type Intent = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

export const INTENTS: Intent[] = [
  {
    id: "career",
    title: "Career Growth",
    description: "Strengthen clarity, decision-making, and stability.",
    icon: "BriefcaseIcon",
  },
  {
    id: "love",
    title: "Love & Relationship",
    description: "Improve emotional connection and harmony.",
    icon: "HeartIcon",
  },
  {
    id: "marriage",
    title: "Marriage",
    description: "Remove obstacles and align for commitment.",
    icon: "MarriageIcon",
  },
  {
    id: "finance",
    title: "Wealth & Finance",
    description: "Attract financial growth and stability.",
    icon: "StarIcon",
  },
  {
    id: "health",
    title: "Health & Wellness",
    description: "Balance mind, body, and inner energy.",
    icon: "WellnessIcon",
  },
  {
    id: "education",
    title: "Education",
    description: "Improve focus, memory, and success in studies.",
    icon: "BookIcon",
  },
];
