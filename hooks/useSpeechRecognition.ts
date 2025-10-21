'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

export interface SpeechRecognitionResultData {
	transcript: string;
	isFinal: boolean;
}

export interface UseSpeechRecognitionOptions {
	language?: string; // BCP-47 code, e.g., 'en-US'
	continuous?: boolean;
	interimResults?: boolean;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
	const { language = 'en-US', continuous = false, interimResults = false } = options;
	const recognitionRef = useRef<any | null>(null);
	const [isSupported, setIsSupported] = useState<boolean>(typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
	const [isListening, setIsListening] = useState(false);
	const [permission, setPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
	const [error, setError] = useState<string | null>(null);

	const apiAvailable = useMemo(() => (typeof window !== 'undefined') && (((window as any).SpeechRecognition) || ((window as any).webkitSpeechRecognition)), []);

	const ensurePermission = useCallback(async () => {
		try {
			// Check if mediaDevices is available
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				console.warn('[Speech] MediaDevices API not available');
				setPermission('denied');
				return false;
			}
			
			// Proactively prompt for mic permission
			await navigator.mediaDevices.getUserMedia({ audio: true });
			setPermission('granted');
			console.log('[Speech] Microphone permission granted');
			return true;
		} catch (e) {
			console.error('[Speech] Microphone permission denied:', e);
			setPermission('denied');
			console.warn('[Speech] Continuing without microphone permission - SpeechRecognition may still work');
			return false;
		}
	}, []);

	const start = useCallback(async () => {
		setError(null);
		if (!apiAvailable) {
			console.warn('[Speech] SpeechRecognition API not available');
			setIsSupported(false);
			setError('Speech recognition not supported in this browser');
			return;
		}

		// Check if we're on HTTPS or localhost for microphone access
		const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
		if (!isSecure) {
			console.warn('[Speech] Microphone access requires HTTPS or localhost');
			setError('Microphone access requires HTTPS. Please use https:// or localhost for voice features.');
			return;
		}

		// Try to get permission, but don't fail if it doesn't work
		const hasPermission = await ensurePermission();
		console.log('[Speech] Permission check result:', hasPermission);
		
		// If permission was denied, show helpful message
		if (!hasPermission) {
			console.warn('[Speech] Starting recognition without explicit permission - may prompt for access');
		}

		try {
			const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
			const recognition = new SpeechRecognitionCtor();
			recognitionRef.current = recognition;
			recognition.lang = language;
			recognition.continuous = continuous;
			recognition.interimResults = interimResults;

			recognition.onstart = () => {
				setIsListening(true);
				console.log('[Speech] Listening started');
			};

			recognition.onend = () => {
				setIsListening(false);
				console.log('[Speech] Listening ended');
			};

			recognition.onerror = (event: any) => {
				const errorType = event?.error;
				
				// Handle different error types appropriately
				if (errorType === 'not-allowed') {
					console.warn('[Speech] Microphone access denied by user - please allow microphone access');
					setError('Microphone access denied. Please allow microphone access and try again.');
				} else if (errorType === 'no-speech') {
					console.warn('[Speech] No speech detected - try speaking louder');
					setError('No speech detected. Please try speaking louder.');
				} else if (errorType === 'audio-capture') {
					console.warn('[Speech] Audio capture failed - check microphone');
					setError('Audio capture failed. Please check your microphone.');
				} else if (errorType === 'network') {
					console.warn('[Speech] Network error - check internet connection');
					setError('Network error. Please check your internet connection.');
				} else {
					console.error('[Speech] Unexpected error:', errorType);
					setError(errorType || 'speech-error');
				}
				
				setIsListening(false);
			};

			recognition.start();
			console.log('[Speech] recognition.start() called with', { language, continuous, interimResults });
		} catch (e: any) {
			console.error('[Speech] Failed to start recognition:', e);
			setError(e?.message || 'failed-to-start');
			setIsListening(false);
		}
	}, [apiAvailable, continuous, ensurePermission, interimResults, language]);

	const stop = useCallback(() => {
		try {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
				console.log('[Speech] recognition.stop() called');
			}
		} catch (e) {
			console.error('[Speech] Failed to stop recognition:', e);
		}
	}, []);

	const attachResultHandler = useCallback((handler: (data: SpeechRecognitionResultData) => void) => {
		if (!recognitionRef.current) return;
		recognitionRef.current.onresult = (event: any) => {
			try {
				const result = event.results[0][0];
				const transcript = result.transcript as string;
				const isFinal = event.results[0].isFinal as boolean;
				console.log('[Speech] onresult:', { transcript, confidence: result.confidence, isFinal });
				handler({ transcript, isFinal });
			} catch (e) {
				console.error('[Speech] onresult parse error:', e);
			}
		};
	}, []);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		isSupported,
		isListening,
		permission,
		error,
		start,
		stop,
		attachResultHandler,
		clearError,
	};
}
