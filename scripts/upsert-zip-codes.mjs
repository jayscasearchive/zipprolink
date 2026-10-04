console.error(
  "Do not upsert ZIP geography directly. That creates indexable pages on the next build.",
);
console.error(
  "Use: npm run zips:publish -- scripts/data/publish-requests/<request>.json",
);
console.error("Default is dry-run. Pass --execute only after evidence is complete.");
process.exit(1);
