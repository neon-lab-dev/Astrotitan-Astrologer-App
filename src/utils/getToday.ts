export const getToday = () => {
  const now = new Date();

  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return `${day}, ${date}`;
};
