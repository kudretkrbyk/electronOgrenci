import React from 'react'
import ReactApexChart from 'react-apexcharts'

export default function ChartsReportPdfContent({ sortedExamResults, chartRefs }) {
  return (
    <div>
      {sortedExamResults.map((ogrenciObjesi, index) => {
        const ogrenciAdi = ogrenciObjesi.ogrenci?.ogr_ad_soyad || 'Bilinmeyen Öğrenci'
        const sinavlar = ogrenciObjesi.sinavlar || []

        // İlk 2 kelime ya da ilk 8 karakter
        const sinavAdlari = sinavlar.map((sinavObjesi) => {
          const sinavAdi = sinavObjesi?.sinav?.sinav_adi || 'Bilinmeyen Sınav'
          // İlk 2 kelime
          const firstTwoWords = sinavAdi.split(' ').slice(0, 2).join(' ')
          // İlk 8 karakter (ihtiyaca göre kullanabilirsiniz)
          const firstEightChars = sinavAdi.substring(0, 8)
          return firstTwoWords // Ya da `firstEightChars`
        })

        const netler = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_net ?? 0)
        const puanlar = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_puan ?? 0)
        const siralamalar = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_siralama ?? 0)

        const commonChartOptions = {
          chart: {
            height: 300,
            type: 'line',
            toolbar: { show: false }
          },
          markers: {
            size: 5 // Marker boyutu
          },
          dataLabels: {
            enabled: true // Marker içindeki değerleri etkinleştir
          },
          xaxis: { categories: sinavAdlari }
        }

        const netOptions = {
          ...commonChartOptions,
          chart: { ...commonChartOptions.chart, id: `chart-${index}-net` },
          title: { text: `${ogrenciAdi} Netleri`, align: 'left' },
          yaxis: {
            min: 0,
            max: 100,
            tickAmount: 5 // 5'er artış için toplam 20 aralık
          }
        }

        const puanOptions = {
          ...commonChartOptions,
          chart: { ...commonChartOptions.chart, id: `chart-${index}-puan` },
          title: { text: `${ogrenciAdi} Puanları`, align: 'left' },
          yaxis: {
            min: 0,
            max: 500,
            tickAmount: 10 // 10'ar artış için toplam 50 aralık
          }
        }

        const siralamaOptions = {
          ...commonChartOptions,
          chart: { ...commonChartOptions.chart, id: `chart-${index}-siralama` },
          title: { text: `${ogrenciAdi} Sıralamaları`, align: 'left' }
        }

        // ChartRefs dizisini her öğrenci için düzenle
        chartRefs.current[index] = {
          net: React.createRef(),
          puan: React.createRef(),
          siralama: React.createRef()
        }

        return (
          <div key={index} style={{ marginBottom: '40px' }}>
            <h2>{ogrenciAdi} Sınav Sonuçları</h2>

            {/* Netler Grafiği */}
            <div id={`chart-${index}-net`}>
              <ReactApexChart
                ref={(el) => (chartRefs.current[index].net = el)}
                options={netOptions}
                series={[{ name: 'Netler', data: netler }]}
                type="line"
                height={300}
              />
            </div>

            {/* Puanlar Grafiği */}
            <div id={`chart-${index}-puan`}>
              <ReactApexChart
                ref={(el) => (chartRefs.current[index].puan = el)}
                options={puanOptions}
                series={[{ name: 'Puanlar', data: puanlar }]}
                type="line"
                height={300}
              />
            </div>

            {/* Sıralamalar Grafiği */}
            <div id={`chart-${index}-siralama`}>
              <ReactApexChart
                ref={(el) => (chartRefs.current[index].siralama = el)}
                options={siralamaOptions}
                series={[{ name: 'Sıralamalar', data: siralamalar }]}
                type="line"
                height={300}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
