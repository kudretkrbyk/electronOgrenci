const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
})

const db = admin.firestore()

async function updateExistingExamResults() {
  const snapshot = await db.collection('sinav_sonuclari').get()

  for (const doc of snapshot.docs) {
    const sinavSonucu = doc.data()

    // `sinav_id` ve `ogrenci_id` kullanarak `sinavlar` ve `ogrenciler` koleksiyonlarından veri çekme
    const sinavDoc = await db.collection('sinavlar').doc(sinavSonucu.sinav_id).get()
    const ogrenciDoc = await db.collection('ogrenciler').doc(sinavSonucu.ogrenci_id).get()

    if (sinavDoc.exists && ogrenciDoc.exists) {
      const sinavAdi = sinavDoc.data().sinav_adi
      const ogrenciAdi = ogrenciDoc.data().ogr_ad_soyad

      // `sinav_adi` ve `ogrenci_adi` alanlarını ekleyerek güncelleme yapın
      await doc.ref.update({
        sinav_adi: sinavAdi,
        ogrenci_adi: ogrenciAdi
      })

      console.log(`Güncellendi: ${doc.id}`)
    } else {
      console.error(`Eksik veri: ${doc.id} için sınav veya öğrenci bulunamadı.`)
    }
  }

  console.log('Tüm belgeler güncellendi.')
}

updateExistingExamResults().catch(console.error)
