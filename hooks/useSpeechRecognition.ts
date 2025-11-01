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
			
			// Check for existing permission first (Android Chrome)
			try {
				if ('permissions' in navigator && 'query' in navigator.permissions) {
					const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
					if (permissionStatus.state === 'granted') {
						setPermission('granted');
						return true;
					} else if (permissionStatus.state === 'denied') {
						setPermission('denied');
						return false;
					}
				}
			} catch (permErr) {
				// Permissions API may not be supported, continue with getUserMedia
				console.log('[Speech] Permissions API not available, using getUserMedia');
			}
			
			// Proactively prompt for mic permission with Android-optimized constraints
			const stream = await navigator.mediaDevices.getUserMedia({ 
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					sampleRate: 16000 // Better for speech recognition on mobile
				} 
			});
			
			// Stop the stream immediately - we just needed permission
			stream.getTracks().forEach(track => track.stop());
			
			setPermission('granted');
			console.log('[Speech] Microphone permission granted');
			return true;
		} catch (e: any) {
			console.error('[Speech] Microphone permission denied:', e);
			setPermission('denied');
			// On Android, SpeechRecognition might still work even if getUserMedia fails
			// because the browser handles permissions differently
			console.warn('[Speech] Continuing without explicit permission - SpeechRecognition may still work on Android');
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
			// Stop any existing recognition first (important for Android)
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (stopErr) {
					// Ignore errors when stopping
				}
				recognitionRef.current = null;
			}

			const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
			const recognition = new SpeechRecognitionCtor();
			recognitionRef.current = recognition;
			recognition.lang = language;
			recognition.continuous = continuous;
			recognition.interimResults = interimResults;

			// Android-specific: Set service URI for better compatibility
			if ((navigator as any).userAgentData?.mobile || /Android/i.test(navigator.userAgent)) {
				console.log('[Speech] Android detected, applying mobile optimizations');
			}

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
					setError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
				} else if (errorType === 'no-speech') {
					console.warn('[Speech] No speech detected - try speaking louder');
					// Don't set error for no-speech on Android - it's common during pauses
					if (!/Android/i.test(navigator.userAgent)) {
						setError('No speech detected. Please try speaking louder.');
					}
					setIsListening(false);
				} else if (errorType === 'audio-capture') {
					console.warn('[Speech] Audio capture failed - check microphone');
					setError('Audio capture failed. Please check your microphone is working and try again.');
				} else if (errorType === 'network') {
					console.warn('[Speech] Network error - check internet connection');
					setError('Network error. Please check your internet connection and try again.');
				} else if (errorType === 'aborted') {
					// Aborted is not an error - user or system stopped it
					console.log('[Speech] Recognition aborted');
					setIsListening(false);
				} else {
					console.error('[Speech] Unexpected error:', errorType);
					setError(errorType || 'speech-error');
				}
				
				if (errorType !== 'no-speech' && errorType !== 'aborted') {
					setIsListening(false);
				}
			};

			// Android: Add a small delay to ensure recognition is ready
			setTimeout(() => {
				try {
					recognition.start();
					console.log('[Speech] recognition.start() called with', { language, continuous, interimResults });
				} catch (startErr: any) {
					console.error('[Speech] Failed to start recognition:', startErr);
					setError(startErr?.message || 'Failed to start speech recognition. Please try again.');
					setIsListening(false);
				}
			}, 100);
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
