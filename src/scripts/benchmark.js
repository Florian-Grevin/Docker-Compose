const autocannon = require('autocannon');
const runBenchmark = async () => {
console.log('🚀 Démarrage du benchmark sur GET /api/stats...');
const result = await autocannon({
url: 'http://localhost:3000/api/stats',
connections: 10, // 10 utilisateurs simultanés
duration: 10, // Pendant 10 secondes
pipelining: 1,
});
console.log('\n📊 RÉSULTATS DU BENCHMARK :');
console.log('------------------------------------------------');
console.log(`Nombre total de requêtes : ${result.requests.total}`);
console.log(`Durée du test : ${result.duration} secondes`);
console.log('------------------------------------------------');
console.log(`Moyenne Latence : ${result.latency.average} ms`);
console.log(`Moyenne Requêtes/sec : ${result.requests.average}`);
console.log('------------------------------------------------');
if (result.latency.average < 50) {
console.log(' CONCLUSION : Le Cache est ACTIF (Réponse ultra-rapide)');
} else {
console.log(' CONCLUSION : Le Cache est INACTIF (Réponse lente)');
}
};
runBenchmark();