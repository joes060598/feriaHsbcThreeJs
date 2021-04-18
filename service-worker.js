;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_programador_hsbc',
  urlsToCache = [
    './',
    // 'https://fonts.googleapis.com/css?family=Raleway:400,700',
    // 'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
    // 'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    // 'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2',
    // './style.css',
    // './script.js',
    // './img/ProgramadorFitness.png',
    // './img/favicon.png'
    './resources/casio.ogg',
    './resources/earth.jpg',
    './resources/help2.png',
    './resources/HSBC_Fondo-Gris-Cielo_2.jpg',
    './resources/HSBC_Fondo-Gris-Cielo_3.jpg',
    './resources/HSBC_Fondo-Gris-Cielo_4.jpg',
    './resources/HSBC_Fondo-Gris-Cielo_6.jpg',
    './resources/music.ogg',
    './resources/negx.jpg',
    './resources/negy.jpg',
    './resources/negz.jpg',
    './resources/posx.jpg',
    './resources/posy.jpg',
    './resources/posz.jpg',
    './resources/readme.txt',
    './resources/TEXTURA-HORIZONTE.jpg',
    './resources/TEXTURA-HORIZONTE1.jpg',
    './resources/TEXTURA-HORIZONTE2.jpg',
    './resources/TEXTURA-HORIZONTE3.jpg',
    './resources/TEXTURA-HORIZONTE4.jpg',
    './resources/TEXTURA-HORIZONTE5.jpg',
    './resources/TEXTURA-HORIZONTE6.jpg',
    './resources/TEXTURA-HORIZONTEb.jpg',
    './resources/thing.glb',
    './models/Balance-01.jpg',
    './models/Cultura-01.jpg',
    './models/Desarrollo-01.jpg',
    './models/edificio-01.jpg',
    './models/finanzas-01.jpg',
    './models/grava.jpg',
    './models/HSBC Entorno_10_CAPAS_BOLICHE.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES Bailar.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES ENTER .fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES Enter Balance.fbx   ',
    './models/HSBC Entorno_10_CAPAS_BOTONES Enter Cultura.fbx   ',
    './models/HSBC Entorno_10_CAPAS_BOTONES Enter Desarrollo.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES Enter Salida.fbx    ',
    './models/HSBC Entorno_10_CAPAS_BOTONES Enter Salud.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES ENTER.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES Finanzas 2.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES Nuevos.fbx',
    './models/HSBC Entorno_10_CAPAS_BOTONES ROJOS.fbx',
    './models/HSBC Entorno_10_CAPAS_Cluster Balance.fbx',
    './models/HSBC Entorno_10_CAPAS_Cluster Cultura.fbx',
    './models/HSBC Entorno_10_CAPAS_Cluster Desarrollo.fbx',
    './models/HSBC Entorno_10_CAPAS_Cluster Finanzas.fbx',
    './models/HSBC Entorno_10_CAPAS_Cluster Salud.fbx',
    './models/HSBC Entorno_10_CAPAS_COMERCIAL.fbx',
    './models/HSBC Entorno_10_CAPAS_DISCO.fbx',
    './models/HSBC Entorno_10_CAPAS_Entrada.fbx',
    './models/HSBC Entorno_10_CAPAS_EXTRAS.fbx',
    './models/HSBC Entorno_10_CAPAS_IGLUS.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Flecha_ moverte.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Flecha_ para.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Flecha_ Usa.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Shift_ correr.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Shift_ para.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Shift_ shift.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Shift_ Usa.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Spacebar_ para.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Spacebar_ saltar 2 (1).fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Spacebar_ saltar.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Spacebar_ spacebar.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS Spacebar_ Usa.fbx',
    './models/HSBC Entorno_10_CAPAS_LETRAS.fbx',
    './models/HSBC Entorno_10_CAPAS_Lounge y Alrededores.fbx',
    './models/HSBC Entorno_10_CAPAS_PATIO fUTBOL.fbx',
    './models/HSBC Entorno_10_CAPAS_PISO.fbx',
    './models/HSBC Entorno_10_CAPAS_porteRIA fUTBOL.fbx',
    './models/HSBC Entorno_10_CAPAS_RAMPA.fbx',
    './models/HSBC Entorno_10_CAPAS_Tecla Flechas.fbx',
    './models/HSBC Entorno_10_CAPAS_Tecla Shift.fbx',
    './models/HSBC Entorno_10_CAPAS_Tecla Spacebar.fbx',
    './models/HSBC Entorno_10_CAPAS_TECLAS INICIO.fbx',
    './models/HSBC Entorno_MASTER 10 (ConP).fbx',
    './models/HSBC Entorno_MASTER 11.2.fbx',
    './models/HSBC Entorno_MASTER 11.fbx',
    './models/HSBC Entorno_MASTER 11_movil.fbx',
    './models/HSBC Entorno_MASTER 8.6 (ConP).fbx',
    './models/HSBC Entorno_MASTER 9 (ConP).fbx',
    './models/HSBC_Fondo-Gris-Cielo_6.jpg',
    './models/IBERO_ENTORNO_V.1.fbx',
    './models/Instrucciones Jugabilidad high.png',
    './models/Instrucciones Jugabilidad.png',
    './models/Instrucciones-Jugabilidad-FINAL-1.png',
    './models/Instrucciones-Jugabilidad-FINAL-3.png',
    './models/isla-saturada.jpg',
    './models/isla.jpg',
    './models/ladrillo.jpg',
    './models/letreros con flechas texturas-01.jpg',
    './models/letreros-con-flechas-texturas-01.jpg',
    './models/madera seamless.jpg',
    './models/madera-seamless.jpg',
    './models/Master Graphic-FWB_OK-01.jpg',
    './models/Master-Graphic-FWB_OK-01.jpg',
    './models/Salud-01.jpg',
    './models/teclas textura 2-01.jpg',
    './models/teclas textura 3-01.jpg',
    './models/teclas textura-01 (1).jpg',
    './models/teclas textura-01.jpg',
    './models/teclas-textura-2-01.jpg',
    './models/teclas-textura-3-01.jpg',
    './models/Textura pista de baile-01.jpg',
    './models/textura-piedra-seamless.jpg',
    './models/Textura-pista-de-baile-01.jpg',
    './models/ventanas-01.jpg',
    
    './models/leon/cara de leon.jpg',
    './models/leon/cara de leon_.jpg',

    './models/leon/LEONCIO TEX/cara de leon.jpg',
    './models/leon/LEONCIO TEX/cara-de-leon.jpg',
    './models/leon/LEONCIO TEX/HSBC_Leon_Air Squats Bend Arms_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Blowing Kiss_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Burpee_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Cheering (Chiquito)_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Cheering_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Hip Hop Dancing_1 (1).fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Robot Hip Hop Dance_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Shuffling_1.fbx',
    './models/leon/LEONCIO TEX/HSBC_Leon_Victory idle_1.fbx',

    './assets/alertify.mis.css',
    './assets/bootstrap.css',
    './assets/bootstrapAlertify.min.css',
    './assets/default.min.css',
    './assets/fontGoogle.css',
    './assets/general.css',
    './assets/loader.css',
    './assets/music.mp3',
    './assets/music2.mp3',
    './assets/responsive.css',
    './assets/semantic.css',

    './assets/img/BeachBallColor.jpg',
    './assets/img/build.png',
    './assets/img/feria.png',
    './assets/img/girl.png',
    './assets/img/HSBC_Fondo-Gris-Cielo_2.jpg',
    './assets/img/instrucciones.png',
    './assets/img/logoHSBC.jpg',
    './assets/img/man.png',
    './assets/img/robot.jpg',
    './assets/img/_.png',
]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})