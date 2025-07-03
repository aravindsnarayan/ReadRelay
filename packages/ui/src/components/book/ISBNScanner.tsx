'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '../base/Button';
import { Text, SmallText } from '../base/Typography';

interface ISBNScannerProps {
  onISBNDetected: (isbn: string) => void;
  onError: (error: string) => void;
  onClose: () => void;
  className?: string;
}

export const ISBNScanner: React.FC<ISBNScannerProps> = ({
  onISBNDetected,
  onError,
  onClose,
  className = '',
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // Remove unused supportsBarcodeDetection state
  const [detectedISBNs, setDetectedISBNs] = useState<Set<string>>(new Set());
  const [scannerType, setScannerType] = useState<'native' | 'quagga' | null>(null);

  // Check for Barcode Detection API support
  useEffect(() => {
    const checkBarcodeSupport = () => {
      if ('BarcodeDetector' in window) {
        setScannerType('native');
      } else {
        setScannerType('quagga');
      }
    };

    checkBarcodeSupport();
  }, []);

  // Validate ISBN format
  const isValidISBN = useCallback((code: string): boolean => {
    const cleanCode = code.replace(/[-\s]/g, '');
    return /^\d{10}(\d{3})?$/.test(cleanCode);
  }, []);

  // Handle detected barcode
  const handleDetectedCode = useCallback((code: string) => {
    if (isValidISBN(code) && !detectedISBNs.has(code)) {
      setDetectedISBNs(prev => new Set([...prev, code]));
      onISBNDetected(code);
    }
  }, [isValidISBN, detectedISBNs, onISBNDetected]);

  // Native Barcode Detection API implementation
  const startNativeScanner = useCallback(async () => {
    if (!('BarcodeDetector' in window) || !videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      setIsScanning(true);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      
      videoRef.current.appendChild(video);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detector = new (window as any).BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'code_128', 'code_39']
      });

      const detectBarcode = async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          try {
            const barcodes = await detector.detect(video);
            if (barcodes.length > 0) {
              handleDetectedCode(barcodes[0].rawValue);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn('Barcode detection error:', err);
          }
        }
        
        if (isScanning) {
          requestAnimationFrame(detectBarcode);
        }
      };

      video.addEventListener('loadedmetadata', () => {
        detectBarcode();
      });

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Native scanner error:', error);
      setHasPermission(false);
      onError('Failed to access camera for native scanning');
      // Fallback to QuaggaJS
      setScannerType('quagga');
      await startQuaggaScanner();
    }
  }, [isScanning, handleDetectedCode, onError]);

  // QuaggaJS implementation
  const startQuaggaScanner = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const QuaggaModule = await import('quagga');
      const Quagga = QuaggaModule.default || QuaggaModule;

      const config = {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: videoRef.current,
          constraints: {
            width: 640,
            height: 480,
            aspectRatio: 1.333
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: 2,
        decoder: {
          readers: ['ean_reader', 'ean_8_reader']
        },
        locate: true
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Quagga.init(config, (err: any) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('QuaggaJS init error:', err);
          setHasPermission(false);
          onError('Failed to initialize barcode scanner');
          return;
        }

        setHasPermission(true);
        setIsScanning(true);
        Quagga.start();
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onDetected = (result: any) => {
        const code = result.codeResult.code;
        handleDetectedCode(code);
      };

      Quagga.onDetected(onDetected);

      return () => {
        Quagga.offDetected(onDetected);
        Quagga.stop();
      };

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('QuaggaJS error:', error);
      onError('Failed to load barcode scanner');
      setHasPermission(false);
    }
  }, [handleDetectedCode, onError]);

  // Start appropriate scanner
  useEffect(() => {
    if (scannerType === 'native') {
      startNativeScanner();
    } else if (scannerType === 'quagga') {
      startQuaggaScanner();
    }

    return () => {
      setIsScanning(false);
      if (videoRef.current) {
        videoRef.current.innerHTML = '';
      }
    };
  }, [scannerType, startNativeScanner, startQuaggaScanner]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setIsScanning(false);
      if (videoRef.current) {
        const video = videoRef.current.querySelector('video');
        if (video && video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  const handleManualInput = () => {
    const isbn = prompt('Enter ISBN manually:');
    if (isbn && isValidISBN(isbn)) {
      handleDetectedCode(isbn);
    } else if (isbn) {
      onError('Invalid ISBN format');
    }
  };

  if (hasPermission === false) {
    return (
      <div className={`bg-white rounded-lg p-6 max-w-md mx-auto ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📷</div>
          <Text className="font-semibold mb-2">Camera Access Required</Text>
          <SmallText color="secondary" className="mb-4">
            Please allow camera access to scan ISBN barcodes
          </SmallText>
          <div className="space-y-2">
            <Button onClick={handleManualInput} className="w-full">
              Enter ISBN Manually
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg overflow-hidden max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <Text className="font-semibold">Scan ISBN Barcode</Text>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <SmallText color="secondary" className="mt-1">
          Point your camera at the ISBN barcode
        </SmallText>
      </div>

      {/* Video Preview */}
      <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
        <div ref={videoRef} className="w-full h-full" />
        
        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-white border-dashed rounded-lg w-64 h-32 flex items-center justify-center">
            <SmallText className="text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              Align barcode here
            </SmallText>
          </div>
        </div>

        {/* Scanner type indicator */}
        <div className="absolute top-2 left-2">
          <SmallText className="text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            {scannerType === 'native' ? 'Native Scanner' : 'QuaggaJS Scanner'}
          </SmallText>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Button onClick={handleManualInput} variant="outline" className="flex-1">
            Manual Entry
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
        
        {detectedISBNs.size > 0 && (
          <div>
            <SmallText color="secondary" className="mb-2">Recently detected:</SmallText>
            <div className="space-y-1">
              {Array.from(detectedISBNs).slice(-3).map(isbn => (
                <SmallText key={isbn} className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {isbn}
                </SmallText>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISBNScanner; 