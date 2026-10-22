const base = process.env.BASE || 'https://www.tuluma.app';
const voseo = /\b(vos|tenés|podés|querés|sabés|sos|mirá|decime|contame|pensá|andá|sentís|necesitás|hacé|fijate|acordate|dale)\b/i;
async function llamar(ruta, cuerpo) {
  const r = await fetch(base + ruta, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
  const t = await r.text();
  return { estado: r.status, texto: t };
}
(async () => {
  const chat = 'Él: che boluda, ayer no me contestaste, qué onda con vos?\nYo: perdón, tuve un día terrible, vos sabés cómo es\nÉl: dale, pero me dejaste re colgado, no sé si querés verme';
  const pruebas = [
    ['descifrar', '/api/descifrar', { texto: chat }],
    ['tarot', '/api/tarot', { cartas: [{ posicion: 'Presente', numero: 6, nombre: 'Los Enamorados', invertida: false, palabrasClave: ['elección', 'unión'] }], pregunta: '¿Qué necesito ver?', preguntaUsuaria: 'Mi ex me escribió, ¿qué hago? No sé si vos me podés ayudar', categoria: 'amor' }],
  ];
  for (const [n, ruta, cuerpo] of pruebas) {
    const { estado, texto } = await llamar(ruta, cuerpo);
    console.log(`\n== ${n} (${estado}) voseo: ${voseo.test(texto)}`);
    console.log(texto.slice(0, 600));
  }
})();
