const redis = require('../config/redis');
/**
* Middleware de Cache
* @param {number} duration - Durée du cache en secondes
*/
const cache = (duration) => {
return async (req, res, next) => {
// 1. Générer une clé unique basée sur l'URL
const key = `cache:${req.originalUrl || req.url}`;
try {
// 2. Vérifier si la donnée existe dans Redis
const cachedData = await redis.get(key);
if (cachedData) {
console.log(` Cache HIT: ${key}`);
// On renvoie le JSON directement et on stoppe la requête ici
return res.json(JSON.parse(cachedData));
}
console.log(` Cache MISS: ${key}`);
// 3. Astuce avancée (Monkey Patching)
// On surcharge la méthode res.json pour intercepter la réponse avant qu'elle parte
const originalJson = res.json;
res.json = (body) => {
// On remet la méthode d'origine pour éviter les boucles infinies
res.json = originalJson;
// On stocke la réponse dans Redis avec un TTL (expiration)
redis.set(key, JSON.stringify(body), 'EX', duration).catch(err => {
console.error('Erreur sauvegarde cache:', err);
});
// On envoie la réponse normalement au client
return originalJson.call(res, body);
};
next();
} catch (err) {
console.error('Erreur Middleware Cache:', err);
next();
}
};
};
module.exports = cache;