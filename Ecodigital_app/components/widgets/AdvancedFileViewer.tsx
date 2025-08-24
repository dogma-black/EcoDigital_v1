/**
 * Visor de archivos avanzado completo
 * Streaming, anotaciones, comparación, metadatos DICOM
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Settings,
  Layers,
  Compare,
  Ruler,
  Pencil,
  Square,
  Circle,
  Type,
  MousePointer,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import advancedFileService, { MediaMetadata, FileAnnotation, StreamingOptions, ComparisonView } from '../../services/advancedFileService';
import { useAuth } from '../AuthContext';

interface AdvancedFileViewerProps {
  fileId: string;
  metadata: MediaMetadata;
  className?: string;
  onClose?: () => void;
}

type AnnotationTool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'measurement' | 'freehand';

export function AdvancedFileViewer({ fileId, metadata, className = '', onClose }: AdvancedFileViewerProps) {
  const { currentUser, trackActivity } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Media states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Viewer states
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'auto'>('auto');
  const [availableQualities, setAvailableQualities] = useState<Array<{ quality: string; bitrate: number; resolution: string }>>([]);
  
  // Annotation states
  const [annotations, setAnnotations] = useState<FileAnnotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<AnnotationTool>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  // Comparison states
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonFiles, setComparisonFiles] = useState<string[]>([]);
  const [comparisonLayout, setComparisonLayout] = useState<'side-by-side' | 'overlay' | 'slider'>('side-by-side');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [processingAnnotation, setProcessingAnnotation] = useState(false);

  useEffect(() => {
    loadAnnotations();
    if (metadata.mimeType.startsWith('video/')) {
      loadAvailableQualities();
    }
  }, [fileId]);

  // ========== DATA LOADING ==========

  const loadAnnotations = async () => {
    try {
      const loadedAnnotations = await advancedFileService.getAnnotations(fileId);
      setAnnotations(loadedAnnotations);
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  };

  const loadAvailableQualities = async () => {
    try {
      const qualities = await advancedFileService.getAvailableQualities(fileId);
      setAvailableQualities(qualities);
    } catch (error) {
      console.error('Error loading qualities:', error);
    }
  };

  // ========== VIDEO CONTROLS ==========

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0];
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // ========== ANNOTATION HANDLERS ==========

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'select') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setIsDrawing(true);
    
    // Start creating new annotation based on selected tool
    const newAnnotation: Omit<FileAnnotation, 'id' | 'createdAt'> = {
      type: selectedTool as any,
      coordinates: { x, y },
      color: '#ff0000',
      strokeWidth: 2,
      createdBy: currentUser?.nombre || 'Unknown',
      isVisible: true
    };
    
    // Save annotation will be called on mouse up
  }, [selectedTool, currentUser]);

  const handleCanvasMouseUp = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool === 'select') return;
    
    setIsDrawing(false);
    setProcessingAnnotation(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      // Create annotation based on tool type
      const annotation: Omit<FileAnnotation, 'id' | 'createdAt'> = {
        type: selectedTool as any,
        coordinates: { x: Math.min(x, 100), y: Math.min(y, 100), width: Math.abs(x - 100), height: Math.abs(y - 100) },
        color: '#ff0000',
        strokeWidth: 2,
        createdBy: currentUser?.nombre || 'Unknown',
        isVisible: true
      };
      
      const savedAnnotation = await advancedFileService.saveAnnotation(fileId, annotation);
      setAnnotations(prev => [...prev, savedAnnotation]);
      
      await trackActivity('ANNOTATION_CREATED', {
        file_id: fileId,
        annotation_type: selectedTool,
        annotation_id: savedAnnotation.id
      });
      
    } catch (error) {
      console.error('Error saving annotation:', error);
    } finally {
      setProcessingAnnotation(false);
    }
  }, [isDrawing, selectedTool, currentUser, fileId, trackActivity]);

  const deleteAnnotation = async (annotationId: string) => {
    try {
      await advancedFileService.deleteAnnotation(fileId, annotationId);
      setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
      
      await trackActivity('ANNOTATION_DELETED', {
        file_id: fileId,
        annotation_id: annotationId
      });
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  };

  const toggleAnnotationVisibility = async (annotationId: string) => {
    try {
      const annotation = annotations.find(ann => ann.id === annotationId);
      if (!annotation) return;
      
      await advancedFileService.updateAnnotation(fileId, annotationId, {
        isVisible: !annotation.isVisible
      });
      
      setAnnotations(prev => prev.map(ann => 
        ann.id === annotationId 
          ? { ...ann, isVisible: !ann.isVisible }
          : ann
      ));
    } catch (error) {
      console.error('Error toggling annotation visibility:', error);
    }
  };

  // ========== COMPARISON HANDLERS ==========

  const startComparison = () => {
    setComparisonMode(true);
    setComparisonFiles([fileId]);
  };

  const addToComparison = (newFileId: string) => {
    setComparisonFiles(prev => [...prev, newFileId]);
  };

  const saveComparisonView = async () => {
    try {
      const comparison: Omit<ComparisonView, 'id' | 'createdAt'> = {
        name: `Comparación ${new Date().toLocaleDateString()}`,
        files: comparisonFiles,
        layout: comparisonLayout,
        syncScroll: true,
        syncZoom: true,
        createdBy: currentUser?.nombre || 'Unknown'
      };
      
      await advancedFileService.createComparisonView(comparison);
      
      await trackActivity('COMPARISON_CREATED', {
        files: comparisonFiles,
        layout: comparisonLayout
      });
    } catch (error) {
      console.error('Error saving comparison view:', error);
    }
  };

  // ========== RENDERING HELPERS ==========

  const getStreamingUrl = () => {
    const options: StreamingOptions = {
      quality,
      adaptive: true
    };
    return advancedFileService.getStreamingUrl(fileId, options);
  };

  const getOptimizedImageUrl = () => {
    return advancedFileService.getOptimizedImageUrl(fileId, {
      width: zoom > 100 ? undefined : 1920,
      quality: quality === 'low' ? 60 : quality === 'medium' ? 80 : 95,
      format: 'webp'
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className={`apple-card ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              {metadata.studyType && (
                <Badge className="bg-blue-500/20 text-blue-400">
                  {metadata.studyType}
                </Badge>
              )}
              {metadata.originalName}
            </CardTitle>
            <p className="text-white/60 text-sm mt-1">
              {formatFileSize(metadata.size)} • {new Date(metadata.uploadDate).toLocaleDateString('es-ES')}
              {metadata.patientId && ` • Paciente: ${metadata.patientId}`}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startComparison}
              className="apple-button-secondary"
            >
              <Compare className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getOptimizedImageUrl(), '_blank')}
              className="apple-button-secondary"
            >
              <Download className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="apple-button-secondary"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* ========== MAIN VIEWER ========== */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Media Display */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {metadata.mimeType.startsWith('video/') ? (
                <video
                  ref={videoRef}
                  src={getStreamingUrl()}
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                  onDurationChange={(e) => setDuration((e.target as HTMLVideoElement).duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={getOptimizedImageUrl()}
                    alt={metadata.originalName}
                    className="w-full h-full object-contain"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease'
                    }}
                  />
                  
                  {/* Annotation Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={handleCanvasMouseUp}
                    style={{ cursor: selectedTool === 'select' ? 'default' : 'crosshair' }}
                  />
                  
                  {/* Annotation Overlay */}
                  {showAnnotations && annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className={`absolute border-2 ${
                        selectedAnnotation === annotation.id ? 'border-blue-500' : 'border-red-500'
                      } ${annotation.isVisible ? 'opacity-100' : 'opacity-30'}`}
                      style={{
                        left: `${annotation.coordinates.x}px`,
                        top: `${annotation.coordinates.y}px`,
                        width: `${annotation.coordinates.width || 0}px`,
                        height: `${annotation.coordinates.height || 0}px`,
                        borderColor: annotation.color,
                        borderWidth: `${annotation.strokeWidth}px`
                      }}
                      onClick={() => setSelectedAnnotation(annotation.id)}
                    >
                      {annotation.text && (
                        <div 
                          className="absolute -top-6 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded"
                        >
                          {annotation.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quality Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/50 text-white">
                  {quality.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Video Controls */}
            {metadata.mimeType.startsWith('video/') && (
              <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = Math.max(0, currentTime - 10);
                        }
                      }}
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                        }
                      }}
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:text-white hover:bg-white/10"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Image Controls */}
            {metadata.mimeType.startsWith('image/') && (
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-4">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoom(Math.max(25, zoom - 25))}
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-white/80 text-sm w-12 text-center">{zoom}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoom(Math.min(400, zoom + 25))}
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Rotation */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRotation((rotation + 90) % 360)}
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>

                  {/* Annotations Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`${showAnnotations ? 'text-blue-400' : 'text-white/60'} hover:text-white hover:bg-white/10`}
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quality Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Calidad:</span>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm"
                  >
                    <option value="auto">Auto</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ========== SIDEBAR TOOLS ========== */}
          <div className="space-y-4">
            <Tabs defaultValue="annotations" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="annotations">Anotaciones</TabsTrigger>
                <TabsTrigger value="metadata">Metadatos</TabsTrigger>
                <TabsTrigger value="comparison">Comparar</TabsTrigger>
              </TabsList>

              {/* ========== ANNOTATIONS TAB ========== */}
              <TabsContent value="annotations" className="space-y-4">
                {/* Annotation Tools */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Herramientas</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { tool: 'select', icon: MousePointer, label: 'Seleccionar' },
                      { tool: 'rectangle', icon: Square, label: 'Rectángulo' },
                      { tool: 'circle', icon: Circle, label: 'Círculo' },
                      { tool: 'text', icon: Type, label: 'Texto' },
                      { tool: 'measurement', icon: Ruler, label: 'Medición' },
                      { tool: 'freehand', icon: Pencil, label: 'Libre' }
                    ].map(({ tool, icon: Icon, label }) => (
                      <Button
                        key={tool}
                        variant={selectedTool === tool ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTool(tool as AnnotationTool)}
                        className={
                          selectedTool === tool 
                            ? "apple-button-primary" 
                            : "apple-button-secondary"
                        }
                        title={label}
                      >
                        <Icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Annotations List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium">Lista de Anotaciones</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnnotations(!showAnnotations)}
                      className="apple-button-secondary"
                    >
                      {showAnnotations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {annotations.map((annotation, index) => (
                      <div
                        key={annotation.id}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedAnnotation === annotation.id
                            ? 'bg-blue-500/20 border-blue-500/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedAnnotation(annotation.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-medium text-sm">
                            {annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)} #{index + 1}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAnnotationVisibility(annotation.id);
                              }}
                              className="text-white/60 hover:text-white h-6 w-6 p-0"
                            >
                              {annotation.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAnnotation(annotation.id);
                              }}
                              className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {annotation.text && (
                          <p className="text-white/80 text-xs">{annotation.text}</p>
                        )}
                        <p className="text-white/60 text-xs mt-1">
                          {annotation.createdBy} • {new Date(annotation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ========== METADATA TAB ========== */}
              <TabsContent value="metadata" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Información del Archivo</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Nombre:</span>
                      <span className="text-white">{metadata.originalName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Tamaño:</span>
                      <span className="text-white">{formatFileSize(metadata.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Tipo:</span>
                      <span className="text-white">{metadata.mimeType}</span>
                    </div>
                    {metadata.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Dimensiones:</span>
                        <span className="text-white">{metadata.dimensions.width} × {metadata.dimensions.height}</span>
                      </div>
                    )}
                    {metadata.duration && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Duración:</span>
                        <span className="text-white">{formatTime(metadata.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Metadata */}
                {metadata.studyType && (
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Información Médica</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Tipo de Estudio:</span>
                        <span className="text-white">{metadata.studyType}</span>
                      </div>
                      {metadata.bodyPart && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Parte del Cuerpo:</span>
                          <span className="text-white">{metadata.bodyPart}</span>
                        </div>
                      )}
                      {metadata.studyDate && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Fecha del Estudio:</span>
                          <span className="text-white">{new Date(metadata.studyDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {metadata.patientId && (
                        <div className="flex justify-between">
                          <span className="text-white/60">ID Paciente:</span>
                          <span className="text-white">{metadata.patientId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DICOM Metadata */}
                {metadata.dicomTags && (
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Metadatos DICOM</h4>
                    
                    <div className="space-y-2 text-sm">
                      {metadata.dicomTags.studyInstanceUID && (
                        <div>
                          <span className="text-white/60">Study UID:</span>
                          <p className="text-white text-xs break-all">{metadata.dicomTags.studyInstanceUID}</p>
                        </div>
                      )}
                      {metadata.dicomTags.seriesInstanceUID && (
                        <div>
                          <span className="text-white/60">Series UID:</span>
                          <p className="text-white text-xs break-all">{metadata.dicomTags.seriesInstanceUID}</p>
                        </div>
                      )}
                      {metadata.dicomTags.studyDescription && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Descripción:</span>
                          <span className="text-white">{metadata.dicomTags.studyDescription}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* ========== COMPARISON TAB ========== */}
              <TabsContent value="comparison" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Modo Comparación</h4>
                  
                  <Button
                    onClick={startComparison}
                    className="w-full apple-button-primary"
                    disabled={comparisonMode}
                  >
                    <Compare className="w-4 h-4 mr-2" />
                    {comparisonMode ? 'Modo Activo' : 'Iniciar Comparación'}
                  </Button>

                  {comparisonMode && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Diseño:</label>
                        <select
                          value={comparisonLayout}
                          onChange={(e) => setComparisonLayout(e.target.value as any)}
                          className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white"
                        >
                          <option value="side-by-side">Lado a Lado</option>
                          <option value="overlay">Superposición</option>
                          <option value="slider">Deslizador</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Archivos en Comparación:</label>
                        <div className="space-y-1">
                          {comparisonFiles.map((fileId, index) => (
                            <div key={fileId} className="text-white/60 text-sm">
                              {index + 1}. {fileId === fileId ? metadata.originalName : `Archivo ${fileId}`}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={saveComparisonView}
                        className="w-full apple-button-secondary"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Vista
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}