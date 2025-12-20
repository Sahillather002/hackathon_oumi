import { randomUUID } from 'crypto';

export function generateId(): string {
    return randomUUID();
}

export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

export function getEstimatedCompletion(hours: number): string {
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
