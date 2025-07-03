declare module 'quagga' {
  interface QuaggaConfig {
    inputStream: {
      name: string;
      type: string;
      target?: HTMLElement | string | null;
      constraints?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
    locator: {
      patchSize: string;
      halfSample: boolean;
    };
    numOfWorkers: number;
    decoder: {
      readers: string[];
    };
    locate: boolean;
  }

  interface DetectionResult {
    codeResult: {
      code: string;
      format: string;
    };
  }

  interface QuaggaStatic {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init(config: QuaggaConfig, callback: (err: any) => void): void;
    start(): void;
    stop(): void;
    onDetected(callback: (result: DetectionResult) => void): void;
    offDetected(callback: (result: DetectionResult) => void): void;
  }

  const Quagga: QuaggaStatic;
  export = Quagga;
} 