const bill = 125; // test with 275, 40, 430

const tip = bill >= 50 && bill <= 300 
  ? bill * 0.15 
  : bill * 0.20;

console.log(
  `The bill was ${bill}, the tip was ${tip}, and the total value ${bill + tip}`
);


// ----- Change test data here -----
const d1 = 96, d2 = 108, d3 = 89;
const k1 = 88, k2 = 91, k3 = 110;
// --------------------------------

// 1. Calculate averages
const avgDolphins = (d1 + d2 + d3) / 3;
const avgKoalas = (k1 + k2 + k3) / 3;

console.log("Dolphins Avg:", avgDolphins);
console.log("Koalas Avg:", avgKoalas);

// BONUS rules
const minScore = 100;

// 2 + BONUS 1 + BONUS 2: Determine winner
if (avgDolphins > avgKoalas && avgDolphins >= minScore) {
  console.log("🏆 Dolphins win the trophy!");
} else if (avgKoalas > avgDolphins && avgKoalas >= minScore) {
  console.log("🏆 Koalas win the trophy!");
} else if (
  avgDolphins === avgKoalas &&
  avgDolphins >= minScore &&
  avgKoalas >= minScore
) {
  console.log("🤝 It's a draw (and both reached the minimum score)!");
} else {
  console.log("❌ No team wins the trophy...");
}
