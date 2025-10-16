'use client';

import { useState } from 'react';

const HardwarePage = () => {
  const [activeComponent, setActiveComponent] = useState('esp32');

  const components = {
    esp32: {
      name: 'ESP32 DevKit V1',
      description: 'Microcontrolador principal',
      icon: '⚡',
      color: 'from-blue-500 to-cyan-500',
      details: {
        'Procesador': 'XTensa® 32-bit LX6 dual-core',
        'Frecuencia': '240 MHz',
        'Memoria': '520 KB SRAM, 4 MB Flash',
        'Conectividad': 'Wi-Fi 802.11 b/g/n, Bluetooth 4.2',
        'Alimentación': '5V o 3.3V',
        'Pines GPIO': '38 pines digitales y analógicos'
      },
      functionality: `Actúa como el cerebro del sistema, encargado de la lectura de sensores, el cálculo de potencia térmica y eléctrica, y el envío de datos hacia la nube o al módulo SIM800L mediante comunicación UART.`
    },
    ads1115: {
      name: 'ADS1115 + Potenciómetros',
      description: 'Sistema de adquisición',
      icon: '📊',
      color: 'from-green-500 to-emerald-500',
      details: {
        'Tipo': 'Convertidor Analógico-Digital (ADC)',
        'Resolución': '16 bits',
        'Canales': '4 canales configurables',
        'Interfaz': 'I²C',
        'Rango de voltaje': '±4.096 V',
        'Potenciómetros': 'Lineales de 10 kΩ'
      },
      functionality: `Convierte las señales analógicas provenientes de los potenciómetros en datos digitales precisos para simular sensores de presión y caudal.`
    },
    ds18b20: {
      name: 'DS18B20',
      description: 'Sensor digital de temperatura',
      icon: '🌡️',
      color: 'from-orange-500 to-red-500',
      details: {
        'Tipo': 'Sensor digital de temperatura',
        'Protocolo': '1-Wire',
        'Rango': '-55 °C a +125 °C',
        'Resolución': '9 a 12 bits programable',
        'Precisión': '±0.5 °C',
        'Aplicación': 'Temperatura de cabeza de pozo'
      },
      functionality: `Simula la temperatura de cabeza de pozo ('wellhead') en grados Celsius, proporcionando lecturas precisas y resistentes al ruido eléctrico.`
    },
    sim800l: {
      name: 'SIM800L',
      description: 'Comunicación GSM/GPRS',
      icon: '📡',
      color: 'from-purple-500 to-pink-500',
      details: {
        'Tipo': 'Módem celular cuatribanda',
        'Bandas': '850/900/1800/1900 MHz',
        'Comunicación': 'UART con ESP32',
        'Alimentación': '3.7V a 4.2V',
        'Protocolos': 'GPRS, HTTP',
        'Formato datos': 'JSON'
      },
      functionality: `Garantiza la conectividad remota cuando no hay red Wi-Fi disponible, permitiendo el envío de información hacia la WebAPI en la nube.`
    },
    interconexion: {
      name: 'Interconexión',
      description: 'Protoboard y cables',
      icon: '🔌',
      color: 'from-gray-500 to-gray-700',
      details: {
        'Protoboard': 'Placa de pruebas sin soldadura',
        'Cables Dupont': 'Machos-macho y macho-hembra',
        'Función': 'Conexiones modulares',
        'Ventaja': 'Montaje limpio y ordenado'
      },
      functionality: `Facilita las pruebas y ajustes durante la etapa de simulación mediante conexiones modulares entre los distintos componentes del sistema.`
    }
  };

  const currentComponent = components[activeComponent];

  return (
    <div className="ml-20 bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Minimalista */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light text-white mb-3 tracking-tight">
            Sistema de Hardware
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Monitoreo Geotérmico - Arquitectura de Componentes
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation - Sidebar Minimal */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-medium text-gray-300 mb-4 px-2">Componentes</h2>
              <nav className="space-y-2">
                {Object.entries(components).map(([key, component]) => (
                  <button
                    key={key}
                    onClick={() => setActiveComponent(key)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeComponent === key
                        ? `bg-gradient-to-r ${component.color} text-white shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{component.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{component.name}</div>
                        <div className="text-xs opacity-70">{component.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* System Overview */}
            <div className="mt-6 bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Flujo del Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">ESP32 → Control</span>
                </div>
                <div className="flex items-center gap-3 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sensores → Datos</span>
                </div>
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">SIM800L → Nube</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Component Header with Gradient */}
              <div className={`bg-gradient-to-r ${currentComponent.color} p-8`}>
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    {currentComponent.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-light mb-1">{currentComponent.name}</h2>
                    <p className="text-white/80 font-light">{currentComponent.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Specifications */}
                  <div>
                    <h3 className="text-xl font-light text-gray-300 mb-6 border-b border-gray-800 pb-2">
                      Especificaciones
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(currentComponent.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-800/50">
                          <span className="text-gray-400 font-light">{key}</span>
                          <span className="text-white font-medium text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Functionality */}
                  <div>
                    <h3 className="text-xl font-light text-gray-300 mb-6 border-b border-gray-800 pb-2">
                      Funcionalidad
                    </h3>
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                      <p className="text-gray-300 leading-relaxed font-light">
                        {currentComponent.functionality}
                      </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-6 flex items-center gap-4 p-4 bg-gray-800/20 rounded-2xl border border-gray-700/30">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-light">Componente activo en sistema</span>
                    </div>
                  </div>
                </div>

                {/* Connection Diagram */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-xl font-light text-gray-300 mb-6">Interconexiones</h3>
                  <div className="bg-gray-800/20 rounded-2xl p-8 border border-gray-700/30">
                    <div className="text-center text-gray-500 mb-4">
                      <div className="text-6xl mb-4 opacity-20">🔗</div>
                      <p className="font-light">Diagrama de conexiones del componente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
                <div className="text-2xl text-blue-400 mb-2">5</div>
                <div className="text-gray-400 text-sm font-light">Componentes</div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
                <div className="text-2xl text-green-400 mb-2">16-bit</div>
                <div className="text-gray-400 text-sm font-light">Resolución ADC</div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
                <div className="text-2xl text-purple-400 mb-2">240 MHz</div>
                <div className="text-gray-400 text-sm font-light">Procesamiento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwarePage;