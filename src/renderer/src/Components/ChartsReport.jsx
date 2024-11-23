import React, { useRef } from 'react'
import useExamsResultsReportData from '../Hooks/useExamsResultsReportData'
import jsPDF from 'jspdf'
import ChartsReportPdfContent from './ChartsReportPdfContent'

const ChartsReport = () => {
  const { examResults, loading, error } = useExamsResultsReportData()
  const chartRefs = useRef([]) // Grafikleri takip etmek için bir ref dizisi

  // Öğrencileri alfabetik sıraya göre sıralama
  const sortedExamResults = examResults
    ? [...examResults].sort((a, b) => {
        const nameA = a.ogrenci?.ogr_ad_soyad?.toLowerCase() || ''
        const nameB = b.ogrenci?.ogr_ad_soyad?.toLowerCase() || ''
        return nameA.localeCompare(nameB)
      })
    : []

  // Sınav adlarını sıralama
  const sortedExamResultsWithSortedExams = sortedExamResults.map((studentResult) => {
    const sortedSinavlar = studentResult.sinavlar
      ? [...studentResult.sinavlar].sort((a, b) => {
          const examNameA = a.sinav?.sinav_adi?.toLowerCase() || ''
          const examNameB = b.sinav?.sinav_adi?.toLowerCase() || ''
          return examNameA.localeCompare(examNameB)
        })
      : []
    return { ...studentResult, sinavlar: sortedSinavlar }
  })

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4') // A4 boyutunda PDF oluşturma
    const pageWidth = pdf.internal.pageSize.width - 20 // Sol ve sağ kenar boşluklarını çıkar
    const pageHeight = pdf.internal.pageSize.height - 20 // Üst ve alt kenar boşluklarını çıkar
    const margin = 10 // Kenar boşluğu
    const chartHeight = 60 // Her bir grafik için sabit yükseklik
    const chartSpacing = 10 // Grafikler arası boşluk

    for (let i = 0; i < chartRefs.current.length; i++) {
      const chartGroup = chartRefs.current[i]
      if (!chartGroup) continue

      // Yeni bir sayfa başlat
      if (i > 0) pdf.addPage()

      // Öğrenci adını PDF'ye ekle
      pdf.setFontSize(14)
      pdf.text(
        `${sortedExamResultsWithSortedExams[i]?.ogrenci?.ogr_ad_soyad || `Öğrenci ${i + 1}`}`,
        margin,
        margin
      )

      let currentY = margin + 10 // Başlık sonrası boşluk

      for (let chartType of ['net', 'puan', 'siralama']) {
        const chart = chartGroup[chartType]
        if (chart) {
          try {
            const { imgURI } = await chart.chart.dataURI({ scale: 1 })
            const imgWidth = pageWidth // Sayfa genişliğini tamamen kapla
            const imgHeight = chartHeight // Sabit yükseklik ayarla

            // Görseli PDF'ye ekle
            pdf.addImage(imgURI, 'PNG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + chartSpacing // Sonraki grafik için boşluk bırak
          } catch (error) {
            console.error(`Error processing chart ${chartType} for student ${i}:`, error)
          }
        } else {
          console.warn(`Chart type ${chartType} not found for student ${i}`)
        }
      }
    }

    pdf.save('charts_report.pdf')
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
        <ChartsReportPdfContent
          sortedExamResults={sortedExamResultsWithSortedExams}
          chartRefs={chartRefs}
        />
      </div>
    </div>
  )
}

export default ChartsReport
