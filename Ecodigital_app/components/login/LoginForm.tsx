import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, LogIn, Loader2, AlertCircle, User, Lock } from 'lucide-react';
import { LoginFormProps } from './types';

export function LoginForm({
  credentials,
  validationErrors,
  isLoading,
  showPassword,
  error,
  onCredentialsChange,
  onTogglePassword,
  onSubmit,
  onClearError
}: LoginFormProps) {
  return (
    <Card className="apple-card">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Acceso seguro al sistema médico
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-red-400 hover:text-red-300"
                  onClick={onClearError}
                >
                  ×
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su email"
                value={credentials.email || ''}
                onChange={(e) => onCredentialsChange('email', e.target.value)}
                className={`pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 ${
                  validationErrors.email ? 'border-red-500/50' : ''
                }`}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-sm">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese su contraseña"
                value={credentials.password}
                onChange={(e) => onCredentialsChange('password', e.target.value)}
                className={`pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 ${
                  validationErrors.password ? 'border-red-500/50' : ''
                }`}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0 text-white/40 hover:text-white/60"
                onClick={onTogglePassword}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-sm">{validationErrors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={credentials.remember_me || false}
              onChange={(e) => onCredentialsChange('remember_me', e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-white/80 text-sm">
              Recordar mi sesión
            </Label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full apple-button-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        {/* Additional Information */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm">
              Sistema protegido con autenticación segura
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-white/40">
              <span>🔒 Cifrado TLS 1.3</span>
              <span>🛡️ Auditoría completa</span>
              <span>🔐 2FA disponible</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}