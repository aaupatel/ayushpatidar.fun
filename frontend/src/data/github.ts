export const githubStats = {
  username: 'aaupatel',
  url: 'https://github.com/aaupatel',
};

// Simulated contribution heatmap — NOT real GitHub data.
// Displayed as a visual representation only, clearly labeled as simulated.
export const contributionData: number[][] = (() => {
  const weeks: number[][] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let w = 0; w < 53; w++) {
    const days: number[] = [];
    for (let d = 0; d < 7; d++) {
      const r = rand();
      const level = r > 0.82 ? 4 : r > 0.65 ? 3 : r > 0.45 ? 2 : r > 0.25 ? 1 : 0;
      days.push(level);
    }
    weeks.push(days);
  }
  return weeks;
})();
