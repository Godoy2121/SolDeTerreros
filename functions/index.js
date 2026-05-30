const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();

exports.enviarNotificacion = onDocumentCreated(
  'notificaciones/{notifId}',
  async (event) => {
    const datos = event.data?.data();
    if (!datos) return;

    const { titulo, mensaje, url = 'https://soldeterreros.web.app' } = datos;

    // Obtener todos los tokens de suscriptores
    const suscriptoresSnap = await getFirestore().collection('suscriptores').get();
    const tokens = suscriptoresSnap.docs
      .map(d => d.data().token)
      .filter(Boolean);

    if (tokens.length === 0) {
      console.log('Sin suscriptores.');
      return;
    }

    console.log(`Enviando a ${tokens.length} suscriptores…`);

    // Enviar en lotes de 500 (límite FCM)
    const BATCH = 500;
    const tokensInvalidos = [];

    for (let i = 0; i < tokens.length; i += BATCH) {
      const lote = tokens.slice(i, i + BATCH);
      const response = await getMessaging().sendEachForMulticast({
        tokens: lote,
        notification: { title: titulo, body: mensaje },
        webpush: {
          notification: {
            title: titulo,
            body: mensaje,
            icon: '/icon-192.svg',
            badge: '/icon-192.svg',
          },
          fcm_options: { link: url },
        },
      });

      response.responses.forEach((r, idx) => {
        if (!r.success) {
          const code = r.error?.code || '';
          if (
            code === 'messaging/invalid-registration-token' ||
            code === 'messaging/registration-token-not-registered'
          ) {
            tokensInvalidos.push(lote[idx]);
          }
        }
      });

      console.log(`Lote ${i / BATCH + 1}: ${response.successCount} OK, ${response.failureCount} errores`);
    }

    // Eliminar tokens inválidos de Firestore
    if (tokensInvalidos.length > 0) {
      const db = getFirestore();
      await Promise.all(
        tokensInvalidos.map(token =>
          db.collection('suscriptores').doc(token).delete()
        )
      );
      console.log(`Eliminados ${tokensInvalidos.length} tokens inválidos.`);
    }

    // Marcar notificación como enviada
    await event.data.ref.update({
      enviada: true,
      enviadaAt: new Date().toISOString(),
      totalEnviados: tokens.length - tokensInvalidos.length,
    });
  }
);
