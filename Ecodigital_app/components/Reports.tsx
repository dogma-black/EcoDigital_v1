import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  FileText,
  Clock,
  Heart,
  Stethoscope,
  Brain,
  DollarSign,
  Target,
  Award,
  AlertTriangle,
  Filter,
  Mail,
  Printer,
  Share
} from 'lucide-react';
import { format } from 'date-fns@3.0.0';
import { es } from 'date-fns@3.0.0/locale';
import { useAuth, useActivityTracker } from './AuthContext';

export function Reports() {
  const { currentUser, hasPermission } = useAuth();
  const { trackActivity } = useActivityTracker();

  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 10, 1), // November 1, 2024
    to: new Date() // Today
  });
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data for medical reports
  const patientsData = [
    { month: 'Ene', nuevos: 12, seguimiento: 25, cirugias: 8 },
    { month: 'Feb', nuevos: 18, seguimiento: 30, cirugias: 12 },
    { month: 'Mar', nuevos: 15, seguimiento: 28, cirugias: 10 },
    { month: 'Abr', nuevos: 22, seguimiento: 35, cirugias: 15 },
    { month: 'May', nuevos: 28, seguimiento: 42, cirugias: 18 },
    { month: 'Jun', nuevos: 25, seguimiento: 38, cirugias: 16 },
    { month: 'Jul', nuevos: 32, seguimiento: 45, cirugias: 20 },
    { month: 'Ago', nuevos: 29, seguimiento: 41, cirugias: 19 },
    { month: 'Sep', nuevos: 35, seguimiento: 48, cirugias: 22 },
    { month: 'Oct', nuevos: 31, seguimiento: 44, cirugias: 21 },
    { month: 'Nov', nuevos: 38, seguimiento: 52, cirugias: 25 },
    { month: 'Dic', nuevos: 42, seguimiento: 58, cirugias: 28 }
  ];

  const diagnosisData = [
    { name: 'Hernia Discal', value: 35, color: '#007aff' },
    { name: 'Estenosis Espinal', value: 28, color: '#af52de' },
    { name: 'Escoliosis', value: 18, color: '#ff2d92' },
    { name: 'Fracturas Vertebrales', value: 12, color: '#30d158' },
    { name: 'Otros', value: 7, color: '#ff9500' }
  ];

  const satisfactionData = [
    { month: 'Ene', satisfaccion: 4.2, respuestas: 45 },
    { month: 'Feb', satisfaccion: 4.5, respuestas: 52 },
    { month: 'Mar', satisfaccion: 4.3, respuestas: 48 },
    { month: 'Abr', satisfaccion: 4.6, respuestas: 58 },
    { month: 'May', satisfaccion: 4.8, respuestas: 65 },
    { month: 'Jun', satisfaccion: 4.7, respuestas: 61 },
    { month: 'Jul', satisfaccion: 4.9, respuestas: 72 },
    { month: 'Ago', satisfaccion: 4.8, respuestas: 68 },
    { month: 'Sep', satisfaccion: 4.9, respuestas: 75 },
    { month: 'Oct', satisfaccion: 4.7, respuestas: 69 },
    { month: 'Nov', satisfaccion: 4.8, respuestas: 73 },
    { month: 'Dic', satisfaccion: 4.9, respuestas: 78 }
  ];

  const revenueData = [
    { month: 'Ene', consultas: 125000, cirugias: 450000, seguimientos: 75000 },
    { month: 'Feb', consultas: 135000, cirugias: 520000, seguimientos: 82000 },
    { month: 'Mar', consultas: 128000, cirugias: 485000, seguimientos: 78000 },
    { month: 'Abr', consultas: 142000, cirugias: 580000, seguimientos: 88000 },
    { month: 'May', consultas: 158000, cirugias: 625000, seguimientos: 95000 },
    { month: 'Jun', consultas: 148000, cirugias: 595000, seguimientos: 89000 },
    { month: 'Jul', consultas: 165000, cirugias: 680000, seguimientos: 102000 },
    { month: 'Ago', consultas: 152000, cirugias: 640000, seguimientos: 94000 },
    { month: 'Sep', consultas: 168000, cirugias: 720000, seguimientos: 108000 },
    { month: 'Oct', consultas: 155000, cirugias: 665000, seguimientos: 98000 },
    { month: 'Nov', consultas: 172000, cirugias: 750000, seguimientos: 112000 },
    { month: 'Dic', consultas: 185000, cirugias: 820000, seguimientos: 125000 }
  ];

  const handleExportReport = async (format: string) => {
    await trackActivity('REPORT_EXPORTED', {
      report_type: selectedReport,
      format: format,
      date_range: {
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString()
      }
    });

    // Simulate export
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="apple-card p-3 border border-white/20">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('$') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes y Analíticas Médicas</h1>
          <p className="text-white/60 mt-1">
            Sistema avanzado de reportes con métricas del consultorio
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="apple-button-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avanzados
          </Button>
          <Button 
            className="apple-button-primary"
            onClick={() => handleExportReport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Date Range and Controls */}
      <Card className="apple-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-white">Período del Reporte</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="apple-button-secondary">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateRange.from ? format(dateRange.from, 'dd MMM', { locale: es }) : 'Desde'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="apple-card border border-white/20 w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-white/60 self-center">hasta</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="apple-button-secondary">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateRange.to ? format(dateRange.to, 'dd MMM', { locale: es }) : 'Hasta'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="apple-card border border-white/20 w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Tipo de Reporte</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="overview">Resumen General</SelectItem>
                  <SelectItem value="patients">Análisis de Pacientes</SelectItem>
                  <SelectItem value="financial">Reporte Financiero</SelectItem>
                  <SelectItem value="clinical">Métricas Clínicas</SelectItem>
                  <SelectItem value="satisfaction">Satisfacción del Paciente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="apple-button-secondary">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
              <Button variant="outline" className="apple-button-secondary">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" className="apple-button-secondary">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Pacientes Totales</p>
                <p className="text-3xl font-bold text-white">387</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+12.5%</span>
                  <span className="text-white/60 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Cirugías Realizadas</p>
                <p className="text-3xl font-bold text-white">28</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+8.2%</span>
                  <span className="text-white/60 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <Stethoscope className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Satisfacción Promedio</p>
                <p className="text-3xl font-bold text-white">4.8/5</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+0.3</span>
                  <span className="text-white/60 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Ingresos del Mes</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(1130000)}</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+15.7%</span>
                  <span className="text-white/60 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500">Resumen</TabsTrigger>
          <TabsTrigger value="patients" className="data-[state=active]:bg-blue-500">Pacientes</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-blue-500">Financiero</TabsTrigger>
          <TabsTrigger value="clinical" className="data-[state=active]:bg-blue-500">Clínico</TabsTrigger>
          <TabsTrigger value="satisfaction" className="data-[state=active]:bg-blue-500">Satisfacción</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Tendencia de Pacientes</CardTitle>
                <CardDescription>Evolución mensual de nuevos pacientes y seguimientos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={patientsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="nuevos" 
                        stackId="1"
                        stroke="#007aff" 
                        fill="rgba(0, 122, 255, 0.3)"
                        name="Nuevos Pacientes"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="seguimiento" 
                        stackId="1"
                        stroke="#30d158" 
                        fill="rgba(48, 209, 88, 0.3)"
                        name="Seguimientos"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Distribución de Diagnósticos</CardTitle>
                <CardDescription>Principales condiciones tratadas en el período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosisData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {diagnosisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-white">Análisis Detallado de Pacientes</CardTitle>
              <CardDescription>Métricas de actividad por tipo de consulta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="nuevos" fill="#007aff" name="Nuevos Pacientes" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="seguimiento" fill="#30d158" name="Seguimientos" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cirugias" fill="#ff2d92" name="Cirugías" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">387</p>
                <p className="text-white/80 text-sm">Total de Pacientes</p>
                <p className="text-green-400 text-xs mt-1">+12.5% este mes</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">52</p>
                <p className="text-white/80 text-sm">Pacientes Activos</p>
                <p className="text-green-400 text-xs mt-1">En tratamiento</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">94.2%</p>
                <p className="text-white/80 text-sm">Tasa de Seguimiento</p>
                <p className="text-green-400 text-xs mt-1">Excelente adherencia</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-white">Análisis de Ingresos por Servicio</CardTitle>
              <CardDescription>Desglose financiero mensual por tipo de consulta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                      tickFormatter={(value) => `$${value / 1000}K`}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      formatter={(value: any) => [formatCurrency(value), '']}
                    />
                    <Bar dataKey="consultas" fill="#007aff" name="Consultas $" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cirugias" fill="#ff2d92" name="Cirugías $" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="seguimientos" fill="#30d158" name="Seguimientos $" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-xl font-bold text-white">{formatCurrency(13560000)}</p>
                <p className="text-white/80 text-sm">Ingresos Totales</p>
                <p className="text-green-400 text-xs mt-1">Año 2024</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Stethoscope className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <p className="text-xl font-bold text-white">{formatCurrency(8200000)}</p>
                <p className="text-white/80 text-sm">Ingresos por Cirugías</p>
                <p className="text-green-400 text-xs mt-1">60.5% del total</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-xl font-bold text-white">{formatCurrency(3850000)}</p>
                <p className="text-white/80 text-sm">Ingresos por Consultas</p>
                <p className="text-yellow-400 text-xs mt-1">28.4% del total</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <p className="text-xl font-bold text-white">{formatCurrency(1510000)}</p>
                <p className="text-white/80 text-sm">Ingresos por Seguimiento</p>
                <p className="text-blue-400 text-xs mt-1">11.1% del total</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Métricas de Resultados Clínicos</CardTitle>
                <CardDescription>Indicadores de calidad y eficacia del tratamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Tasa de Éxito Quirúrgico</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <span className="text-green-400 font-semibold">96%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Tiempo Promedio de Cirugía</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-semibold">2.3h</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Complicaciones Post-operatorias</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-semibold">2.1%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Tiempo de Recuperación Promedio</span>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-white font-semibold">6.2 semanas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Análisis con IA</CardTitle>
                <CardDescription>Métricas de uso del asistente de IA médica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Documentos Analizados</span>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-white font-semibold">234</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Precisión de Diagnóstico IA</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                      <span className="text-purple-400 font-semibold">94%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Tiempo de Análisis Promedio</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-semibold">1.2 min</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Consultas IA por Día</span>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-white font-semibold">47</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-white">Evolución de Satisfacción del Paciente</CardTitle>
              <CardDescription>Calificaciones mensuales y tendencias de satisfacción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    />
                    <YAxis 
                      domain={[3.5, 5]}
                      tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaccion" 
                      stroke="#ff9500" 
                      strokeWidth={3}
                      dot={{ fill: '#ff9500', strokeWidth: 2, r: 6 }}
                      name="Satisfacción"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">4.8</p>
                <p className="text-white/80 text-sm">Calificación Promedio</p>
                <p className="text-green-400 text-xs mt-1">De 5 estrellas</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">758</p>
                <p className="text-white/80 text-sm">Respuestas Recibidas</p>
                <p className="text-blue-400 text-xs mt-1">92% tasa de respuesta</p>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">96%</p>
                <p className="text-white/80 text-sm">Recomendarían</p>
                <p className="text-green-400 text-xs mt-1">El consultorio a otros</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="apple-card">
        <CardHeader>
          <CardTitle className="text-white">Opciones de Exportación</CardTitle>
          <CardDescription>
            Genere y descargue reportes en diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="apple-button-secondary flex items-center gap-2"
              onClick={() => handleExportReport('pdf')}
            >
              <FileText className="h-4 w-4" />
              Reporte PDF
            </Button>
            <Button 
              variant="outline" 
              className="apple-button-secondary flex items-center gap-2"
              onClick={() => handleExportReport('excel')}
            >
              <BarChart3 className="h-4 w-4" />
              Excel/CSV
            </Button>
            <Button 
              variant="outline" 
              className="apple-button-secondary flex items-center gap-2"
              onClick={() => handleExportReport('powerpoint')}
            >
              <Download className="h-4 w-4" />
              PowerPoint
            </Button>
            <Button 
              variant="outline" 
              className="apple-button-secondary flex items-center gap-2"
              onClick={() => handleExportReport('scheduled')}
            >
              <Mail className="h-4 w-4" />
              Programar Envío
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}