/**
 * Sistema de Modales Especializados
 * Según especificación técnica - Sección 4.4.d (Modales)
 */

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  Loader2
} from 'lucide-react';

// Modal de Formulario
export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FormModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isSubmitting = false,
  disabled = false,
  size = 'md'
}: FormModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`apple-card border border-white/20 ${sizeClasses[size]}`}>
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-white/60">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onCancel || onClose}
            disabled={isSubmitting}
            className="flex-1 apple-button-secondary"
          >
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={disabled || isSubmitting}
              className="flex-1 apple-button-primary"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {submitLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Modal de Confirmación
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'warning';
  isLoading?: boolean;
  details?: string[];
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  isLoading = false,
  details = []
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default:
        return 'apple-button-primary';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="apple-card border border-white/20">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-white/80">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {details.length > 0 && (
          <div className="py-4">
            <Alert className="bg-white/5 border-white/20">
              <AlertDescription className="text-white/80">
                <div className="space-y-1">
                  {details.map((detail, index) => (
                    <div key={index} className="text-sm">• {detail}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isLoading}
            className="apple-button-secondary"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className={getConfirmButtonClass()}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Modal de Información/Alerta
export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  details?: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  details = [],
  actionLabel = 'Entendido',
  onAction
}: InfoModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="apple-card border border-white/20 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <div className="flex-1">
              <DialogTitle className="text-white">{title}</DialogTitle>
              <Badge className={`mt-1 ${getBadgeColor()}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-white/80">{message}</p>
          
          {details.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-white/90">Detalles:</h4>
              <div className="bg-white/5 rounded-lg p-3 space-y-1">
                {details.map((detail, index) => (
                  <div key={index} className="text-sm text-white/70">
                    • {detail}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            onClick={onAction || onClose}
            className="flex-1 apple-button-primary"
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook para usar los modales
export function useModal() {
  const [formModal, setFormModal] = React.useState<{
    isOpen: boolean;
    props: Omit<FormModalProps, 'isOpen' | 'onClose'>;
  }>({ isOpen: false, props: {} as any });

  const [confirmationModal, setConfirmationModal] = React.useState<{
    isOpen: boolean;
    props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>;
  }>({ isOpen: false, props: {} as any });

  const [infoModal, setInfoModal] = React.useState<{
    isOpen: boolean;
    props: Omit<InfoModalProps, 'isOpen' | 'onClose'>;
  }>({ isOpen: false, props: {} as any });

  const showFormModal = (props: Omit<FormModalProps, 'isOpen' | 'onClose'>) => {
    setFormModal({ isOpen: true, props });
  };

  const showConfirmationModal = (props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>) => {
    setConfirmationModal({ isOpen: true, props });
  };

  const showInfoModal = (props: Omit<InfoModalProps, 'isOpen' | 'onClose'>) => {
    setInfoModal({ isOpen: true, props });
  };

  const closeFormModal = () => setFormModal(prev => ({ ...prev, isOpen: false }));
  const closeConfirmationModal = () => setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  const closeInfoModal = () => setInfoModal(prev => ({ ...prev, isOpen: false }));

  return {
    // Form Modal
    FormModal: () => (
      <FormModal
        {...formModal.props}
        isOpen={formModal.isOpen}
        onClose={closeFormModal}
      />
    ),
    showFormModal,
    closeFormModal,

    // Confirmation Modal
    ConfirmationModal: () => (
      <ConfirmationModal
        {...confirmationModal.props}
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
      />
    ),
    showConfirmationModal,
    closeConfirmationModal,

    // Info Modal
    InfoModal: () => (
      <InfoModal
        {...infoModal.props}
        isOpen={infoModal.isOpen}
        onClose={closeInfoModal}
      />
    ),
    showInfoModal,
    closeInfoModal
  };
}