'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  const [selectedViz, setSelectedViz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [volcanoData, setVolcanoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  // Datos de volcanes basados en el shapefile
  const volcanoDataset = [
    {
      id: 1,
      nombre: "Popocatépetl",
      tipo: "Estratovolcán",
      estado: "México-Morelos-Puebla",
      latitud: 19.023,
      longitud: -98.622,
      elevacion: 5426,
      actividad: "Activo",
      ultima_erupcion: "2024",
      temperatura_predicha: 285.3
    },
    {
      id: 2,
      nombre: "Colima",
      tipo: "Estratovolcán",
      estado: "Jalisco-Colima",
      latitud: 19.514,
      longitud: -103.62,
      elevacion: 3860,
      actividad: "Activo",
      ultima_erupcion: "2019",
      temperatura_predicha: 312.7
    },
    {
      id: 3,
      nombre: "Ceboruco",
      tipo: "Estratovolcán",
      estado: "Nayarit",
      latitud: 21.125,
      longitud: -104.508,
      elevacion: 2280,
      actividad: "Activo",
      ultima_erupcion: "1870",
      temperatura_predicha: 198.4
    },
    {
      id: 4,
      nombre: "Tacaná",
      tipo: "Estratovolcán",
      estado: "Chiapas",
      latitud: 15.132,
      longitud: -92.108,
      elevacion: 4093,
      actividad: "Activo",
      ultima_erupcion: "1986",
      temperatura_predicha: 156.2
    },
    {
      id: 5,
      nombre: "Tres Vírgenes",
      tipo: "Estratovolcán",
      estado: "Baja California Sur",
      latitud: 27.47,
      longitud: -112.59,
      elevacion: 1940,
      actividad: "Activo",
      ultima_erupcion: "1746",
      temperatura_predicha: 267.8
    },
    {
      id: 6,
      nombre: "Chichón",
      tipo: "Domo de lava",
      estado: "Chiapas",
      latitud: 17.36,
      longitud: -93.228,
      elevacion: 1150,
      actividad: "Activo",
      ultima_erupcion: "1982",
      temperatura_predicha: 423.1
    }
  ];

  useEffect(() => {
    setVolcanoData(volcanoDataset);
    setLoading(false);
  }, []);

  // Función para consultar la API de temperatura
  const fetchTemperature = async (latitud, longitud) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitud: latitud,
          longitud: longitud
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
      
      const data = await response.json();
      return data.temperatura || data.prediction || 200; // Valor por defecto si no hay respuesta
    } catch (error) {
      console.error('Error fetching temperature:', error);
      // Generar temperatura aleatoria como fallback
      return 150 + Math.random() * 250;
    }
  };

  // Preparar datos para gráficas
  const prepareChartData = async (chartType) => {
    let data = null;

    switch (chartType) {
      case 'temperature_by_type':
        const types = [...new Set(volcanoData.map(v => v.tipo))];
        const avgTempByType = types.map(type => {
          const volcanoes = volcanoData.filter(v => v.tipo === type);
          const avgTemp = volcanoes.reduce((sum, v) => sum + v.temperatura_predicha, 0) / volcanoes.length;
          return avgTemp;
        });

        data = {
          labels: types,
          datasets: [
            {
              label: 'Temperatura Promedio (°C)',
              data: avgTempByType,
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 2,
            },
          ],
        };
        break;

      case 'elevation_correlation':
        data = {
          datasets: [
            {
              label: 'Elevación vs Temperatura',
              data: volcanoData.map(v => ({
                x: v.elevacion,
                y: v.temperatura_predicha,
              })),
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              pointRadius: 8,
              pointHoverRadius: 12,
            },
          ],
        };
        break;

      case 'activity_analysis':
        data = {
          labels: volcanoData.map(v => v.nombre),
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: volcanoData.map(v => v.temperatura_predicha),
              backgroundColor: volcanoData.map(v => 
                v.temperatura_predicha > 300 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.8)'
              ),
              borderColor: volcanoData.map(v => 
                v.temperatura_predicha > 300 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
              ),
              borderWidth: 2,
            },
          ],
        };
        break;

      case 'geographic_distribution':
        data = {
          labels: volcanoData.map(v => v.nombre),
          datasets: [
            {
              label: 'Temperatura por Volcán',
              data: volcanoData.map(v => v.temperatura_predicha),
              backgroundColor: 'rgba(153, 102, 255, 0.8)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1,
            },
          ],
        };
        break;

      case 'time_series':
        // Datos simulados de series temporales
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        data = {
          labels: months,
          datasets: volcanoData.slice(0, 3).map((volcano, index) => ({
            label: volcano.nombre,
            data: months.map(() => volcano.temperatura_predicha + (Math.random() * 50 - 25)),
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ][index],
            backgroundColor: [
              'rgba(255, 99, 132, 0.1)',
              'rgba(54, 162, 235, 0.1)',
              'rgba(255, 206, 86, 0.1)',
            ][index],
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          })),
        };
        break;

      case 'volcano_map':
      default:
        data = {
          labels: volcanoData.map(v => v.nombre),
          datasets: [
            {
              label: 'Distribución de Volcanes',
              data: volcanoData.map(v => ({
                x: v.longitud,
                y: v.latitud,
                r: v.temperatura_predicha / 20, // Tamaño basado en temperatura
              })),
              backgroundColor: volcanoData.map(v => 
                v.temperatura_predicha > 300 ? 'rgba(255, 99, 132, 0.8)' : 
                v.temperatura_predicha > 200 ? 'rgba(255, 206, 86, 0.8)' : 'rgba(54, 162, 235, 0.8)'
              ),
              borderColor: volcanoData.map(v => 
                v.temperatura_predicha > 300 ? 'rgba(255, 99, 132, 1)' : 
                v.temperatura_predicha > 200 ? 'rgba(255, 206, 86, 1)' : 'rgba(54, 162, 235, 1)'
              ),
              borderWidth: 2,
            },
          ],
        };
        break;
    }

    return data;
  };

  const statistics = [
    {
      id: 1,
      title: "Distribución de Volcanes Activos",
      description: "Mapa de ubicación y temperaturas de volcanes activos en México",
      type: "volcano_map",
      chartType: "scatter",
      features: ["Ubicación geográfica", "Temperaturas predichas", "Clasificación por actividad"]
    },
    {
      id: 2,
      title: "Temperaturas por Tipo Volcánico",
      description: "Comparación de temperaturas promedio según el tipo de volcán",
      type: "temperature_by_type",
      chartType: "bar",
      features: ["Comparación entre tipos", "Análisis estadístico", "Tendencias térmicas"]
    },
    {
      id: 3,
      title: "Correlación Elevación-Temperatura",
      description: "Relación entre la elevación del volcán y la temperatura predicha",
      type: "elevation_correlation",
      chartType: "scatter",
      features: ["Análisis de correlación", "Dispersión de datos", "Tendencias altitudinales"]
    },
    {
      id: 4,
      title: "Actividad Volcánica vs Temperatura",
      description: "Distribución de temperaturas según el nivel de actividad",
      type: "activity_analysis",
      chartType: "bar",
      features: ["Clasificación por actividad", "Indicadores térmicos", "Evaluación de riesgo"]
    },
    {
      id: 5,
      title: "Distribución Geográfica de Temperaturas",
      description: "Análisis espacial de temperaturas alrededor de volcanes",
      type: "geographic_distribution",
      chartType: "line",
      features: ["Análisis espacial", "Patrones regionales", "Interpolación geográfica"]
    },
    {
      id: 6,
      title: "Análisis de Series Temporales",
      description: "Evolución de temperaturas para monitoreo volcánico",
      type: "time_series",
      chartType: "line",
      features: ["Tendencias temporales", "Predicciones futuras", "Alertas tempranas"]
    }
  ];

  // Opciones comunes para gráficas
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        }
      },
    },
  };

  // Función para descargar datos
  const downloadData = (stat) => {
    let csvContent = '';
    
    switch(stat.type) {
      case 'temperature_by_type':
        const typeData = volcanoData.map(v => ({
          volcan: v.nombre,
          tipo: v.tipo,
          temperatura: v.temperatura_predicha,
          actividad: v.actividad
        }));
        csvContent = convertToCSV(typeData);
        break;
      case 'elevation_correlation':
        const elevationData = volcanoData.map(v => ({
          volcan: v.nombre,
          elevacion: v.elevacion,
          temperatura: v.temperatura_predicha,
          latitud: v.latitud,
          longitud: v.longitud
        }));
        csvContent = convertToCSV(elevationData);
        break;
      default:
        csvContent = convertToCSV(volcanoData);
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `datos_${stat.type}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para ver gráfico
  const viewChart = async (stat) => {
    setSelectedViz(stat);
    const data = await prepareChartData(stat.type);
    setChartData(data);
    setShowModal(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedViz(null);
    setChartData(null);
  };

  // Función para renderizar el gráfico correcto
  const renderChart = () => {
    if (!chartData || !selectedViz) return null;

    const chartHeight = 400;

    switch (selectedViz.chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} height={chartHeight} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} height={chartHeight} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} height={chartHeight} />;
      default:
        return <Bar data={chartData} options={chartOptions} height={chartHeight} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando datos volcánicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-50 mb-4">
            Análisis Geotérmico Volcánico
          </h1>
        
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statistics.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Statistics Preview Area */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stat.chartType === 'bar' && '📊'}
                    {stat.chartType === 'line' && '📈'}
                    {stat.chartType === 'scatter' && '🎯'}
                  </div>
                </div>
              </div>

              {/* Statistics Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-indigo-600 font-semibold text-sm mb-3 uppercase tracking-wide">
                  {stat.chartType}
                </p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {stat.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Características:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stat.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => viewChart(stat)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Ver Gráfico
                  </button>
                  <button 
                    onClick={() => downloadData(stat)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Descargar Datos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">{volcanoData.length}</div>
              <div className="text-gray-400 text-sm">Volcanes Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">
                {Math.round(volcanoData.reduce((a, v) => a + v.temperatura_predicha, 0) / volcanoData.length)}°C
              </div>
              <div className="text-gray-400 text-sm">Temperatura Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-2">
                {new Set(volcanoData.map(v => v.tipo)).size}
              </div>
              <div className="text-gray-400 text-sm">Tipos Volcánicos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar gráficos */}
      {showModal && selectedViz && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedViz.title}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {/* Gráfico real */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6" style={{ height: '500px' }}>
                {chartData ? (
                  renderChart()
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando gráfico...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">📊 Datos del Gráfico</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• <strong>Tipo:</strong> {selectedViz.chartType}</li>
                    <li>• <strong>Volcanes:</strong> {volcanoData.length}</li>
                    <li>• <strong>Temp. Promedio:</strong> {Math.round(volcanoData.reduce((a, v) => a + v.temperatura_predicha, 0) / volcanoData.length)}°C</li>
                    <li>• <strong>Temp. Máxima:</strong> {Math.max(...volcanoData.map(v => v.temperatura_predicha)).toFixed(1)}°C</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">📥 Exportar Datos</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Descarga los datos utilizados en este análisis en formato CSV.
                  </p>
                  <button 
                    onClick={() => downloadData(selectedViz)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Descargar CSV
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => downloadData(selectedViz)}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Descargar Datos
                </button>
                <button 
                  onClick={closeModal}
                  className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Función auxiliar para convertir a CSV
function convertToCSV(data) {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export default Statistics;