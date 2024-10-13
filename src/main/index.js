import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import admin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json'

// Firebase uygulamasını başlatma
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wpclone-63e54-default-rtdb.firebaseio.com'
})

const db = admin.firestore()

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// GET istekleri
const getOgrenciler = async () => {
  const snapshot = await db.collection('ogrenciler').get()
  const ogrenciler = snapshot.docs.map((doc) => ({
    id: doc.id,
    ogr_ad_soyad: doc.data().ogr_ad_soyad,
    ogr_sinif: doc.data().ogr_sinif,
    ogr_sube: doc.data().ogr_sube
  }))
  console.log('öprenciler', ogrenciler)
  return { data: ogrenciler }
}

const getSinavlar = async () => {
  const snapshot = await db.collection('sinavlar').get()
  const sinavlar = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return { data: sinavlar }
}

const getOgrenciSinavSonuclari = async (ogrenciId = null) => {
  console.log('getOgrenciSinavSonuclari geldi')
  let sinavSonuclariSnapshot

  // Öğrenci ID'si varsa, o öğrenciye ait sonuçları al
  if (ogrenciId) {
    sinavSonuclariSnapshot = await db
      .collection('sinav_sonuclari')
      .where('ogrenci_id', '==', ogrenciId)
      .get()
  }
  // Öğrenci ID'si yoksa tüm sınav sonuçlarını al
  else {
    sinavSonuclariSnapshot = await db.collection('sinav_sonuclari').get()
  }

  if (sinavSonuclariSnapshot.empty) {
    throw new Error('Sınav sonuçları bulunamadı.')
  }

  const ogrenciSinavGruplari = {}

  for (const sinavSonucuDoc of sinavSonuclariSnapshot.docs) {
    const sinavSonucu = sinavSonucuDoc.data()
    const sinavDoc = await db.collection('sinavlar').doc(sinavSonucu.sinav_id).get()
    const sinavBilgisi = sinavDoc.data()
    const ogrenciDoc = await db.collection('ogrenciler').doc(sinavSonucu.ogrenci_id).get()
    const ogrenciBilgisi = ogrenciDoc.data()

    if (!ogrenciSinavGruplari[sinavSonucu.ogrenci_id]) {
      ogrenciSinavGruplari[sinavSonucu.ogrenci_id] = { ogrenci: ogrenciBilgisi, sinavlar: [] }
    }

    ogrenciSinavGruplari[sinavSonucu.ogrenci_id].sinavlar.push({
      sinav: sinavBilgisi,
      sinav_puan: sinavSonucu.sinav_puan,
      sinav_siralama: sinavSonucu.sinav_siralama,
      sinav_net: sinavSonucu.sinav_net
    })
  }

  console.log('öğrenci full sonuçlar', ogrenciSinavGruplari)
  return { data: Object.values(ogrenciSinavGruplari) }
}

// POST istekleri
const postExams = async (data) => {
  const { sinav_adi, sinav_tarihi, sinava_giren_sayisi } = data

  if (!sinav_adi || !sinav_tarihi || !sinava_giren_sayisi) {
    throw new Error('Lütfen gerekli tüm alanları doldurun.')
  }

  const examRef = await db.collection('sinavlar').add({
    sinav_adi,
    sinav_tarihi: new Date(sinav_tarihi),
    sinava_giren_sayisi
  })

  return { id: examRef.id, message: 'Sınav başarıyla eklendi.' }
}

const postExamsResult = async (data) => {
  const { ogrenci_id, sinav_id, sinav_net, sinav_puan, sinav_siralama } = data

  if (!ogrenci_id || !sinav_id || !sinav_net || !sinav_puan || !sinav_siralama) {
    throw new Error('Lütfen gerekli tüm alanları doldurun.')
  }

  const resultRef = await db.collection('sinav_sonuclari').add({
    ogrenci_id,
    sinav_id,
    sinav_net,
    sinav_puan,
    sinav_siralama
  })

  return { id: resultRef.id, message: 'Sınav sonucu başarıyla eklendi.' }
}

const postStudents = async (data) => {
  const { ogr_ad_soyad, ogr_sinif, ogr_sube } = data

  if (!ogr_ad_soyad || !ogr_sinif || !ogr_sube) {
    throw new Error('Lütfen gerekli tüm alanları doldurun.')
  }

  const studentRef = await db.collection('ogrenciler').add({
    ogr_ad_soyad,
    ogr_sinif,
    ogr_sube
  })

  return { id: studentRef.id, message: 'Öğrenci başarıyla eklendi.' }
}

// IPC ile API çağrıları
ipcMain.on('fetch-students', async (event) => {
  console.log('fetch-students geldi')
  try {
    const studentsResponse = await getOgrenciler()
    event.reply('students-response', { data: studentsResponse })
  } catch (error) {
    event.reply('students-response', { error: error.message })
  }
})

ipcMain.on('fetch-exam-results', async (event, studentId) => {
  try {
    const examResultsResponse = await getOgrenciSinavSonuclari(studentId)
    event.reply('exam-results-response', { data: examResultsResponse })
  } catch (error) {
    event.reply('exam-results-response', { error: error.message })
  }
})

ipcMain.on('fetch-exams', async (event) => {
  try {
    const examsResponse = await getSinavlar()
    event.reply('exams-response', { data: examsResponse })
  } catch (error) {
    event.reply('exams-response', { error: error.message })
  }
})
// API'de tüm sınav sonuçlarını almayı dinle
ipcMain.on('fetch-all-exam-results', async (event) => {
  console.log('fetch-all-exam-results geldi')
  try {
    const responseData = await getOgrenciSinavSonuclari(null) // Öğrenci ID'siz tüm sonuçlar
    event.reply('all-exam-results-response', { data: responseData })
  } catch (error) {
    event.reply('all-exam-results-response', { error: error.message })
  }
})

ipcMain.on('post-exam', async (event, { data }) => {
  console.log('Gelen sınav verisi:', data) // Gelen veriyi konsolda kontrol edelim
  try {
    if (!data || !data.sinav_adi || !data.sinav_tarihi || !data.sinava_giren_sayisi) {
      throw new Error('Lütfen gerekli tüm alanları doldurun.')
    }

    const postExamResponse = await postExams(data)
    event.reply('post-exam-response', { data: postExamResponse })
  } catch (error) {
    event.reply('post-exam-response', { error: error.message })
  }
})

ipcMain.on('post-student', async (event, { data }) => {
  try {
    const postStudentResponse = await postStudents(data)
    event.reply('post-student-response', { data: postStudentResponse })
  } catch (error) {
    event.reply('post-student-response', { error: error.message })
  }
})

ipcMain.on('post-exam-result', async (event, { data }) => {
  try {
    const postExamResultResponse = await postExamsResult(data)
    event.reply('post-exam-result-response', { data: postExamResultResponse })
  } catch (error) {
    event.reply('post-exam-result-response', { error: error.message })
  }
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
