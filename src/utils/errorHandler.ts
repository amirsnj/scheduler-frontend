import { useNotificationStore } from "@/store/notificationStore";
import { currentLanguage } from "@/main";
import { locales } from "@/locales/schedulerLocales/index";

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ErrorHandler {
  private static notificationStore = useNotificationStore();

  static handle(error: any, context?: string): AppError {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    let appError: AppError = {
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    };

    if (error.response) {
      // API Error
      appError = {
        message: error.response.data?.message || error.response.data?.detail || "API Error",
        code: error.response.data?.code || "API_ERROR",
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Network Error
      appError = {
        message: "Network error - please check your connection",
        code: "NETWORK_ERROR",
      };
    } else if (error.message) {
      // Generic Error
      appError = {
        message: error.message,
        code: error.code || "GENERIC_ERROR",
      };
    }

    // Show notification
    this.showErrorNotification(appError, context);

    return appError;
  }

  static showErrorNotification(error: AppError, context?: string): void {
    const message = this.getLocalizedErrorMessage(error, context);
    this.notificationStore.showError(message);
  }

  static getLocalizedErrorMessage(error: AppError, context?: string): string {
    const locale = locales[currentLanguage.value] as any;
    
    // Try to get localized error message
    const errorKey = `error${error.code || 'Generic'}`;
    if (locale[errorKey]) {
      return locale[errorKey];
    }

    // Fallback to context-specific messages
    if (context) {
      const contextKey = `error${context.charAt(0).toUpperCase() + context.slice(1)}`;
      if (locale[contextKey]) {
        return locale[contextKey];
      }
    }

    // Return the error message or fallback
    return error.message || locale.errorGeneric || "An error occurred";
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }

  static isNetworkError(error: any): boolean {
    return !error.response && error.request;
  }

  static isApiError(error: any): boolean {
    return !!error.response;
  }

  static getErrorStatus(error: any): number | undefined {
    return error.response?.status;
  }
}

// Convenience functions
export const handleError = (error: any, context?: string) => 
  ErrorHandler.handle(error, context);

export const withErrorHandling = <T>(
  operation: () => Promise<T>,
  context?: string
) => ErrorHandler.withErrorHandling(operation, context);
