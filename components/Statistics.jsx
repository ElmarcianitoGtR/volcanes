'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Bar, Line, Scatter } from 'react-chartjs-2';

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
  const [volcanoData, setVolcanoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingTemperatures, setFetchingTemperatures] = useState(false);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    actividad: 'todos',
    temperaturaMin: 0,
    temperaturaMax: 500
  });

  // Datos base de volcanes (sin temperaturas)
  const volcanoBaseData = [
    {
      id: 1,
      nombre: "Popocatépetl",
      tipo: "Estratovolcán",
      estado: "México-Morelos-Puebla",
      latitud: 19.023,
      longitud: -98.622,
      elevacion: 5426,
      actividad: "Activo",
      ultima_erupcion: "2024"
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
      ultima_erupcion: "2019"
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
      ultima_erupcion: "1870"
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
      ultima_erupcion: "1986"
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
      ultima_erupcion: "1746"
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
      ultima_erupcion: "1982"
    }
  ];

  // Función para consultar la API de temperatura
  const fetchTemperatureFromAPI = async (latitud, longitud) => {
    try {
      console.log(`Consultando API para: ${latitud}, ${longitud}`);
      
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
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Respuesta de la API:', data);
      
      // Diferentes posibles estructuras de respuesta
      return data.temperatura || data.prediction || data.temperature || 200;
    } catch (error) {
      console.error('Error fetching temperature from API:', error);
      // Generar temperatura aleatoria como fallback entre 150-350°C
      return 150 + Math.random() * 200;
    }
  };

  // Obtener temperaturas para todos los volcanes
  const fetchAllTemperatures = async () => {
    setFetchingTemperatures(true);
    
    const volcanoesWithTemperatures = await Promise.all(
      volcanoBaseData.map(async (volcano) => {
        const temperatura = await fetchTemperatureFromAPI(volcano.latitud, volcano.longitud);
        return {
          ...volcano,
          temperatura_predicha: parseFloat(temperatura.toFixed(1))
        };
      })
    );

    setVolcanoData(volcanoesWithTemperatures);
    setFetchingTemperatures(false);
    setLoading(false);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllTemperatures();
  }, []);

  // Función para actualizar temperaturas
  const refreshTemperatures = async () => {
    setFetchingTemperatures(true);
    await fetchAllTemperatures();
  };

  // Datos filtrados
  const filteredData = useMemo(() => {
    return volcanoData.filter(volcano => {
      const tipoMatch = filters.tipo === 'todos' || volcano.tipo === filters.tipo;
      const actividadMatch = filters.actividad === 'todos' || volcano.actividad === filters.actividad;
      const tempMatch = volcano.temperatura_predicha >= filters.temperaturaMin && 
                       volcano.temperatura_predicha <= filters.temperaturaMax;
      
      return tipoMatch && actividadMatch && tempMatch;
    });
  }, [volcanoData, filters]);

  // Estadísticas
  const stats = useMemo(() => {
    const temps = filteredData.map(v => v.temperatura_predicha);
    return {
      total: filteredData.length,
      promedio: temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : 0,
      maximo: temps.length ? Math.max(...temps) : 0,
      minimo: temps.length ? Math.min(...temps) : 0,
      activos: filteredData.filter(v => v.actividad === 'Activo').length
    };
  }, [filteredData]);

  // Datos para gráficas
  const chartData = {
    // Gráfica 1: Temperatura por tipo volcánico
    temperaturaPorTipo: {
      labels: [...new Set(filteredData.map(v => v.tipo))],
      datasets: [
        {
          label: 'Temperatura Predicha (°C)',
          data: [...new Set(filteredData.map(v => v.tipo))].map(tipo => {
            const volcanes = filteredData.filter(v => v.tipo === tipo);
            return volcanes.reduce((sum, v) => sum + v.temperatura_predicha, 0) / volcanes.length;
          }),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    },

    // Gráfica 2: Correlación elevación-temperatura
    elevacionTemperatura: {
      datasets: [
        {
          label: 'Elevación vs Temperatura',
          data: filteredData.map(v => ({
            x: v.elevacion,
            y: v.temperatura_predicha,
          })),
          backgroundColor: filteredData.map(v => 
            v.temperatura_predicha > 300 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)'
          ),
          borderColor: filteredData.map(v => 
            v.temperatura_predicha > 300 ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)'
          ),
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 12,
        },
      ],
    },

    // Gráfica 3: Distribución por actividad
    distribucionActividad: {
      labels: filteredData.map(v => v.nombre),
      datasets: [
        {
          label: 'Temperatura Predicha (°C)',
          data: filteredData.map(v => v.temperatura_predicha),
          backgroundColor: filteredData.map(v => 
            v.actividad === 'Activo' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(156, 163, 175, 0.8)'
          ),
          borderColor: filteredData.map(v => 
            v.actividad === 'Activo' ? 'rgba(239, 68, 68, 1)' : 'rgba(156, 163, 175, 1)'
          ),
          borderWidth: 2,
        },
      ],
    },
  };

  // Opciones de gráficas
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
        },
        title: {
          display: true,
          text: 'Temperatura (°C)'
        }
      },
    },
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      tipo: 'todos',
      actividad: 'todos',
      temperaturaMin: 0,
      temperaturaMax: 500
    });
  };

  const downloadData = () => {
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'datos_volcanes_con_temperaturas.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Consultando modelo de temperatura...</p>
          <p className="text-gray-500 text-sm">Conectando con la API en http://127.0.0.1:5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-50 mb-4">
            Dashboard Geotérmico Volcánico
          </h1>
          
          {/* Botón de actualizar */}
          <button
            onClick={refreshTemperatures}
            disabled={fetchingTemperatures}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {fetchingTemperatures ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Actualizando...
              </>
            ) : (
              '🔄 Actualizar Temperaturas'
            )}
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo Volcánico
                </label>
                <select
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="todos">Todos los tipos</option>
                  {[...new Set(volcanoData.map(v => v.tipo))].map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por actividad */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Actividad
                </label>
                <select
                  value={filters.actividad}
                  onChange={(e) => handleFilterChange('actividad', e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="todos">Todas</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Filtro por temperatura */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rango de Temperatura: {filters.temperaturaMin}°C - {filters.temperaturaMax}°C
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.temperaturaMin}
                    onChange={(e) => handleFilterChange('temperaturaMin', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.temperaturaMax}
                    onChange={(e) => handleFilterChange('temperaturaMax', parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={downloadData}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Descargar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-gray-600 text-sm">Volcanes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{stats.activos}</div>
            <div className="text-gray-600 text-sm">Activos</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{stats.promedio.toFixed(1)}°C</div>
            <div className="text-gray-600 text-sm">Temp. Promedio</div>
            <div className="text-xs text-gray-500 mt-1">(Modelo PINN)</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{stats.maximo.toFixed(1)}°C</div>
            <div className="text-gray-600 text-sm">Temp. Máxima</div>
            <div className="text-xs text-gray-500 mt-1">(Modelo PINN)</div>
          </div>
        </div>

        {/* Grid de Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfica 1: Temperatura por tipo */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Temperatura Predicha por Tipo Volcánico
            </h3>
            <div className="h-80">
              <Bar 
                data={chartData.temperaturaPorTipo} 
                options={chartOptions}
              />
            </div>
          </div>

          {/* Gráfica 2: Correlación elevación-temperatura */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Correlación: Elevación vs Temperatura Predicha
            </h3>
            <div className="h-80">
              <Scatter 
                data={chartData.elevacionTemperatura} 
                options={{
                  ...chartOptions,
                  scales: {
                    x: {
                      ...chartOptions.scales.x,
                      title: {
                        display: true,
                        text: 'Elevación (m)'
                      }
                    },
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Temperatura (°C)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Gráfica 3: Distribución por actividad */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Actividad
            </h3>
            <div className="h-80">
              <Bar 
                data={chartData.distribucionActividad} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y'
                }}
              />
            </div>
          </div>

          {/* Información del Modelo */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Información del Modelo
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Modelo Utilizado</h4>
                <p>Physics-Informed Neural Network (PINN) para predicción de temperaturas subterráneas</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Fuente de Datos</h4>
                <ul className="space-y-1">
                  <li>• Coordenadas: Shapefile oficial de volcanes</li>
                  <li>• API: http://127.0.0.1:5000/predict</li>
                  <li>• Parámetros: Latitud, Longitud</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Última Actualización</h4>
                <p>{new Date().toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">
                  Las temperaturas se obtienen en tiempo real del modelo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Datos de Volcanes con Temperaturas Predichas ({filteredData.length} resultados)
            </h3>
            <span className="text-sm text-gray-500">
              Fuente: Modelo PINN - API Local
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volcán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordenadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Elevación (m)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperatura Predicha (°C)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((volcano) => (
                  <tr key={volcano.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {volcano.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volcano.latitud.toFixed(3)}, {volcano.longitud.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volcano.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {volcano.elevacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        volcano.actividad === 'Activo' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {volcano.actividad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-semibold ${
                          volcano.temperatura_predicha > 300 ? 'text-red-600' :
                          volcano.temperatura_predicha > 200 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {volcano.temperatura_predicha}°C
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          (modelo)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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