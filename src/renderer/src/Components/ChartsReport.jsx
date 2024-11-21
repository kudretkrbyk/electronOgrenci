import ReactApexChart from 'react-apexcharts'
import useExamsResultsReportData from '../Hooks/useExamsResultsReportData'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ChartsReport = () => {
  const { examResults, loading, error } = useExamsResultsReportData()

  // ExamResults verisini alfabetik sıraya göre düzenle
  const sortedExamResults = examResults
    ? [...examResults].sort((a, b) => {
        const nameA = a.ogrenci?.ogr_ad_soyad?.toLowerCase() || ''
        const nameB = b.ogrenci?.ogr_ad_soyad?.toLowerCase() || ''
        return nameA.localeCompare(nameB)
      })
    : []

  const generatePDF = () => {
    const pdf = new jsPDF()
    const input = document.getElementById('pdf-content')
    const charts = input.getElementsByTagName('canvas') // Tüm grafikleri alır

    let currentPageHeight = 0
    const pageHeight = 295 // A4 boyutunda bir PDF sayfası
    const margin = 10 // Kenar boşluğu

    const addImageToPDF = (imgData, imgHeight) => {
      if (currentPageHeight + imgHeight > pageHeight) {
        // Eğer görsel sayfaya sığmıyorsa yeni bir sayfa aç
        pdf.addPage()
        currentPageHeight = 0
      }
      pdf.addImage(imgData, 'PNG', margin, currentPageHeight + margin, 180, imgHeight)
      currentPageHeight += imgHeight + margin
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const imgHeight = (canvas.height * 180) / canvas.width
      addImageToPDF(imgData, imgHeight)

      for (let i = 0; i < charts.length; i++) {
        const chartCanvas = charts[i]
        const chartImgData = chartCanvas.toDataURL('image/png')
        const chartImgHeight = (chartCanvas.height * 180) / chartCanvas.width
        addImageToPDF(chartImgData, chartImgHeight)
      }

      pdf.save('charts_report.pdf')
    })
  }

  if (loading) {
    return <p>Veriler yükleniyor...</p>
  }
  if (error) {
    return <p>Sınav sonuçları bulunamadı.</p>
  }

  return (
    <div className="p-10">
      <button
        onClick={generatePDF}
        className="mt-4 p-2 bg-blue-500 text-white rounded fixed top-10 right-0"
      >
        PDF Oluştur
      </button>
      <div id="pdf-content">
        {sortedExamResults.map((ogrenciObjesi, index) => {
          const ogrenciAdi = ogrenciObjesi.ogrenci?.ogr_ad_soyad || 'Bilinmeyen Öğrenci'
          const sinavlar = ogrenciObjesi.sinavlar || []

          const sinavAdlari = sinavlar.map(
            (sinavObjesi) => sinavObjesi?.sinav?.sinav_adi || 'Bilinmeyen Sınav'
          )
          const netler = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_net ?? 0)
          const puanlar = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_puan ?? 0)
          const siralamalar = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_siralama ?? 0)

          const netBaslik = `${ogrenciAdi} netleri`
          const puanBaslik = `${ogrenciAdi} puanları`
          const siralamaBaslik = `${ogrenciAdi} sıralamaları`

          const netOptions = {
            chart: {
              zoom: { enabled: false },
              height: 350,
              type: 'line',
              toolbar: {
                show: false
              }
            },
            xaxis: {
              categories: sinavAdlari
            },
            yaxis: {
              title: {
                text: 'Netler'
              },
              min: 0,
              max: 100,
              tickAmount: 5
            },
            dataLabels: {
              enabled: true
            },
            title: {
              text: netBaslik,
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
              }
            },
            markers: {
              size: 5
            }
          }

          const puanOptions = {
            chart: {
              zoom: { enabled: false },
              height: 350,
              type: 'line',
              toolbar: {
                show: false
              }
            },
            xaxis: {
              categories: sinavAdlari,
              title: {
                text: 'Sınavlar'
              }
            },
            yaxis: {
              title: {
                text: 'Puanlar'
              },
              min: 0,
              max: 500,
              tickAmount: 10
            },
            dataLabels: {
              enabled: true
            },
            title: {
              text: puanBaslik,
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
              }
            }
          }

          const siralamaOptions = {
            chart: {
              zoom: { enabled: false },
              height: 350,
              type: 'line',
              toolbar: {
                show: false
              }
            },
            xaxis: {
              categories: sinavAdlari,
              title: {
                text: 'Sınavlar'
              }
            },
            yaxis: {
              title: {
                text: 'Sıralamalar'
              },
              min: 0,
              max: Math.max(...siralamalar),
              tickAmount: 5
            },
            dataLabels: {
              enabled: true
            },
            title: {
              text: siralamaBaslik,
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
              }
            }
          }

          return (
            <div key={index} className="p-10">
              <h2 className="w-full bg-gray-200 p-2 font-bold text-2xl">
                {ogrenciAdi} Sınav Sonuçları
              </h2>

              {/* Netler Grafiği */}
              <div id={`net-chart-${index}`}>
                <ReactApexChart
                  options={netOptions}
                  series={[{ name: 'Netler', data: netler }]}
                  type="line"
                  height={200}
                ></ReactApexChart>
              </div>

              {/* Puanlar Grafiği */}
              <div id={`puan-chart-${index}`}>
                <ReactApexChart
                  options={puanOptions}
                  series={[{ name: 'Puanlar', data: puanlar }]}
                  type="line"
                  height={300}
                ></ReactApexChart>
              </div>

              {/* Sıralamalar Grafiği */}
              <div id={`siralama-chart-${index}`}>
                <ReactApexChart
                  options={siralamaOptions}
                  series={[{ name: 'Sıralamalar', data: siralamalar }]}
                  type="line"
                  height={300}
                ></ReactApexChart>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChartsReport
