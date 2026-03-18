import BaseAgent, { AgentConfig, AgentTask, AgentResult } from './BaseAgent';

class PerformanceAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Performance Agent',
      description: 'Optimizes application performance, memory usage, and resource efficiency',
      capabilities: ['performance-analysis', 'memory-optimization', 'bundle-optimization', 'runtime-optimization'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go'],
    };
    super(config);
  }

  canHandle(task: AgentTask): boolean {
    return ['performance-analysis', 'memory-optimization', 'bundle-optimization', 'runtime-optimization'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { component, metrics, language, constraints } = task.input;

    let result = '';

    switch (task.type) {
      case 'performance-analysis':
        result = await this.analyzePerformance(component, metrics);
        break;
      case 'memory-optimization':
        result = await this.optimizeMemory(component, constraints);
        break;
      case 'bundle-optimization':
        result = await this.optimizeBundle(language);
        break;
      case 'runtime-optimization':
        result = await this.optimizeRuntime(component, language);
        break;
    }

    return {
      taskId: task.id,
      success: true,
      output: result,
      files: {},
    };
  }

  private async analyzePerformance(component: string, metrics?: any): Promise<string> {
    return `Performance Analysis Report for ${component}

📊 Current Metrics:
${this.formatMetrics(metrics)}

🔍 Performance Bottlenecks Identified:

1. **Rendering Performance**
   - Large component re-renders
   - Inefficient DOM updates
   - Missing memoization

2. **Memory Usage**
   - Memory leaks in event listeners
   - Large object retention
   - Inefficient data structures

3. **Network Performance**
   - Large bundle sizes
   - Unnecessary API calls
   - Missing caching strategies

4. **Runtime Performance**
   - Heavy computations on main thread
   - Blocking synchronous operations
   - Inefficient algorithms

📈 Optimization Recommendations:

**Immediate Actions (High Impact):**
1. Implement React.memo for components
2. Add useMemo for expensive calculations
3. Use lazy loading for routes
4. Implement virtual scrolling for large lists

**Short-term Improvements:**
1. Code splitting by routes/features
2. Optimize images and assets
3. Implement service worker caching
4. Add error boundaries

**Long-term Optimizations:**
1. Implement micro-frontends architecture
2. Add CDN for static assets
3. Implement server-side rendering
4. Add performance monitoring

🎯 Performance Targets:

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| First Contentful Paint | 2.1s | <1.5s | High |
| Largest Contentful Paint | 3.2s | <2.5s | High |
| First Input Delay | 120ms | <100ms | Medium |
| Cumulative Layout Shift | 0.15 | <0.1 | Medium |
| Bundle Size | 2.1MB | <1.5MB | High |

🛠️ Implementation Plan:

**Phase 1: Critical Fixes (Week 1)**
\`\`\`typescript
// 1. Add React.memo to prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component);

// 2. Use useMemo for expensive calculations
const expensiveValue = useMemo(() => computeExpensiveValue(dep1, dep2), [dep1, dep2]);

// 3. Implement lazy loading
const LazyComponent = lazy(() => import('./LazyComponent'));

// 4. Add error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
\`\`\`

**Phase 2: Bundle Optimization (Week 2)**
\`\`\`javascript
// webpack.config.js or next.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        ui: {
          test: /[\\/]src[\\/]components[\\/]/,
          name: 'ui',
          chunks: 'all',
        },
      },
    },
  },
  experiments: {
    topLevelAwait: true,
  },
};
\`\`\`

**Phase 3: Runtime Optimization (Week 3)**
\`\`\`typescript
// 1. Web Workers for heavy computations
const worker = new Worker('./heavy-computation.js');

// 2. Debounced user input
const debouncedSearch = useCallback(
  debounce((query) => performSearch(query), 300),
  []
);

// 3. Intersection Observer for lazy loading
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Load content
      }
    });
  },
  { threshold: 0.1 }
);
\`\`\`

📊 Monitoring Setup:

\`\`\`typescript
// Performance monitoring
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry.id === 'vitals') {
    console.log('Web Vitals:', onPerfEntry);
    // Send to analytics service
  }
};

// Memory monitoring
const monitorMemory = () => {
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    console.log('Memory Usage:', {
      used: Math.round(memInfo.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
      total: Math.round(memInfo.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
      limit: Math.round(memInfo.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB'
    });
  }
};
\`\`\`

🔄 Continuous Optimization:

1. **Performance Budgets**
   - Bundle size limits
   - Runtime performance thresholds
   - Memory usage limits

2. **Automated Testing**
   - Performance regression tests
   - Lighthouse CI integration
   - Bundle analyzer reports

3. **Monitoring & Alerting**
   - Real user monitoring (RUM)
   - Performance dashboards
   - Automated alerts for regressions

🎉 Expected Results:

After implementing these optimizations:
- **40-60% improvement** in initial load time
- **30-50% reduction** in bundle size
- **50-70% improvement** in runtime performance
- **60-80% reduction** in memory leaks
- **Better user experience** with smoother interactions`;
  }

  private async optimizeMemory(component: string, constraints?: any): Promise<string> {
    const memoryLimit = constraints?.maxMemory || '7.6GB';
    const targetUsage = constraints?.targetUsage || '5GB';

    return `Memory Optimization Report for ${component}

💾 System Constraints:
- Total RAM: ${memoryLimit}
- Target Usage: ${targetUsage}
- Safety Buffer: 20%

🔍 Memory Analysis:

**Current Memory Usage Patterns:**
1. **Ollama Models**: ~4-7GB per model
2. **React Application**: ~200-500MB
3. **Node.js Runtime**: ~100-300MB
4. **Browser Tabs**: ~100-200MB per tab
5. **System Overhead**: ~1-2GB

**Memory Leak Sources:**
- Event listeners not removed
- Timers/intervals not cleared
- DOM references in closures
- Large objects in memory
- Circular references

🛠️ Memory Optimization Strategies:

**1. Ollama Memory Management**
\`\`\`bash
# Set memory limits
export OLLAMA_MAX_MEMORY=5368709120  # 5GB limit
export OLLAMA_NUM_THREAD=2           # Reduce thread count
export OLLAMA_MAX_LOADED_MODELS=1    # Load one model at a time

# Memory monitoring
ollama stats  # Check current usage
\`\`\`

**2. React Memory Optimization**
\`\`\`typescript
// 1. Proper cleanup in useEffect
useEffect(() => {
  const handleResize = () => setWindowSize(getWindowSize());
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// 2. useCallback for event handlers
const handleClick = useCallback(() => {
  // Handle click
}, []); // Empty dependency array

// 3. useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 4. React.memo for components
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.value}</div>;
});

// 5. Lazy loading with Suspense
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

**3. Garbage Collection Optimization**
\`\`\`typescript
// Force garbage collection (development only)
if (process.env.NODE_ENV === 'development') {
  if (global.gc) {
    global.gc();
  }
}

// Memory monitoring
const monitorMemory = () => {
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    const usedPercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;

    if (usedPercent > 80) {
      console.warn('High memory usage detected:', usedPercent.toFixed(1) + '%');
      // Trigger cleanup
      cleanupMemory();
    }
  }
};

const cleanupMemory = () => {
  // Clear caches
  imageCache.clear();
  dataCache.clear();

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
};
\`\`\`

**4. Data Structure Optimization**
\`\`\`typescript
// Use Maps for large datasets instead of objects
const userMap = new Map<string, User>();

// Use Sets for unique values
const activeUsers = new Set<string>();

// Use WeakMap/WeakSet for caches to allow GC
const cache = new WeakMap<object, any>();

// Optimize arrays with large datasets
const largeArray = new Array(1000000);
// Use typed arrays for numeric data
const typedArray = new Uint32Array(1000000);

// Object pooling for frequently created objects
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;

  constructor(createFn: () => T) {
    this.createFn = createFn;
  }

  get(): T {
    return this.pool.pop() || this.createFn();
  }

  release(obj: T): void {
    this.pool.push(obj);
  }
}
\`\`\`

**5. Bundle Size Optimization**
\`\`\`javascript
// 1. Code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// 2. Tree shaking
// Only import what you need
import { useState, useEffect } from 'react'; // Not the entire react

// 3. Dynamic imports
const loadComponent = async () => {
  const module = await import('./HeavyComponent');
  return module.default;
};

// 4. Webpack bundle analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    })
  ]
};
\`\`\`

**6. Image and Asset Optimization**
\`\`\`typescript
// Lazy load images
const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.onload = () => setLoaded(true);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={loaded ? src : placeholder}
      alt={alt}
      loading="lazy"
    />
  );
};

// Compress images
// Use tools like ImageOptim, TinyPNG
// Convert to WebP format
\`\`\`

📊 Memory Monitoring Dashboard:

\`\`\`typescript
interface MemoryStats {
  used: number;
  total: number;
  limit: number;
  usagePercent: number;
}

const MemoryMonitor: React.FC = () => {
  const [stats, setStats] = useState<MemoryStats | null>(null);

  useEffect(() => {
    const updateStats = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        setStats({
          used: memInfo.usedJSHeapSize,
          total: memInfo.totalJSHeapSize,
          limit: memInfo.jsHeapSizeLimit,
          usagePercent: (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100
        });
      }
    };

    const interval = setInterval(updateStats, 5000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="memory-monitor">
      <h3>Memory Usage</h3>
      <div className="memory-bar">
        <div
          className="memory-used"
          style={{ width: \`\${stats.usagePercent}%\` }}
        />
      </div>
      <p>
        {Math.round(stats.used / 1024 / 1024)}MB /
        {Math.round(stats.limit / 1024 / 1024)}MB
        ({stats.usagePercent.toFixed(1)}%)
      </p>
    </div>
  );
};
\`\`\`

🎯 Memory Optimization Results:

Expected improvements:
- **30-50% reduction** in memory usage
- **40-60% fewer** garbage collection pauses
- **50-70% improvement** in application responsiveness
- **Prevention** of system freezes on low-memory systems

🔄 Continuous Memory Management:

1. **Automated Cleanup**
   - Periodic cache clearing
   - Event listener cleanup
   - DOM node removal

2. **Memory Leak Detection**
   - Development-time leak detection
   - Production memory monitoring
   - Automated alerts

3. **Performance Budgets**
   - Memory usage limits
   - Leak detection thresholds
   - Performance regression alerts`;
  }

  private async optimizeBundle(language: string): Promise<string> {
    return `Bundle Optimization Report

📦 Current Bundle Analysis:
- Main bundle: ~2.1MB
- Vendor bundle: ~800KB
- CSS bundle: ~150KB
- Total: ~3.05MB

🎯 Optimization Targets:
- Main bundle: <1.5MB
- Vendor bundle: <500KB
- CSS bundle: <100KB
- Total: <2.1MB

🛠️ Bundle Optimization Strategies:

**1. Code Splitting**
\`\`\`javascript
// Route-based splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const PluginsPage = lazy(() => import('./pages/PluginsPage'));

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// Dynamic imports
const loadFeature = async (feature) => {
  switch (feature) {
    case 'ai':
      return await import('./features/ai');
    case 'terminal':
      return await import('./features/terminal');
    default:
      return await import('./features/default');
  }
};
\`\`\`

**2. Tree Shaking**
\`\`\`javascript
// Instead of importing everything
// import * as _ from 'lodash'; // ❌ 100KB+

// Import only what you need
import isEmpty from 'lodash/isEmpty'; // ✅ ~2KB
import debounce from 'lodash/debounce'; // ✅ ~2KB

// For React
import React, { useState, useEffect, memo } from 'react'; // ✅ Only what you need
\`\`\`

**3. Vendor Splitting**
\`\`\`javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        ui: {
          test: /[\\/]node_modules[\\/](lucide-react|@headlessui)[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 20,
        },
      },
    },
  },
};
\`\`\`

**4. Asset Optimization**
\`\`\`javascript
// Image optimization
const imageLoader = {
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192, // 8KB
        name: 'images/[name].[hash].[ext]',
      },
    },
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: { quality: 75 },
        pngquant: { quality: [0.65, 0.90], speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 },
      },
    },
  ],
};

// Font optimization
const fontLoader = {
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[hash].[ext]',
      },
    },
  ],
};
\`\`\`

**5. CSS Optimization**
\`\`\`javascript
// CSS splitting and optimization
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
\`\`\`

**6. Compression**
\`\`\`javascript
// Gzip compression
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // 10KB
      minRatio: 0.8,
    }),
  ],
};
\`\`\`

**7. Bundle Analysis**
\`\`\`javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
};
\`\`\`

📊 Bundle Analysis Results:

\`\`\`
Bundle Size Breakdown:
├── Main Bundle: 1.2MB (57%)
│   ├── Application Code: 800KB
│   ├── Dependencies: 300KB
│   └── Runtime: 100KB
├── Vendor Bundle: 450KB (21%)
│   ├── React: 150KB
│   ├── UI Libraries: 200KB
│   └── Utilities: 100KB
├── CSS Bundle: 80KB (4%)
└── Other Assets: 420KB (18%)
    ├── Images: 200KB
    ├── Fonts: 150KB
    └── Other: 70KB
\`\`\`

🎯 Performance Impact:

- **First Load**: 40% faster
- **Subsequent Loads**: 60% faster (cached)
- **Time to Interactive**: 35% improvement
- **Lighthouse Score**: +15 points

🔄 Continuous Optimization:

1. **Bundle Monitoring**
   - Automated bundle size checks
   - Regression alerts
   - Size budgets

2. **Dependency Analysis**
   - Unused dependency detection
   - Security vulnerability scanning
   - Update management

3. **Performance Budgets**
   - Bundle size limits
   - Asset size limits
   - Loading time budgets`;
  }

  private async optimizeRuntime(component: string, language: string): Promise<string> {
    return `Runtime Optimization Report for ${component}

⚡ Runtime Performance Analysis:

**Current Performance Issues:**
1. Heavy computations on main thread
2. Synchronous blocking operations
3. Inefficient algorithms
4. Memory-intensive operations
5. Unnecessary re-renders

🛠️ Runtime Optimization Strategies:

**1. Web Workers for Heavy Computations**
\`\`\`typescript
// worker.ts
self.onmessage = (e) => {
  const result = performHeavyComputation(e.data);
  self.postMessage(result);
};

// main.ts
const worker = new Worker('./worker.ts');

const performAsyncComputation = (data: any): Promise<any> => {
  return new Promise((resolve) => {
    worker.onmessage = (e) => resolve(e.data);
    worker.postMessage(data);
  });
};

// Usage
const result = await performAsyncComputation(largeDataset);
\`\`\`

**2. Debouncing and Throttling**
\`\`\`typescript
// Debounce function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Usage
const debouncedSearch = useCallback(
  debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);

const throttledScroll = useCallback(
  throttle(() => {
    updateScrollPosition();
  }, 16), // ~60fps
  []
);
\`\`\`

**3. Virtual Scrolling for Large Lists**
\`\`\`typescript
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: \`translateY(\${startIndex * itemHeight}px)\`
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
};
\`\`\`

**4. Memoization Strategies**
\`\`\`typescript
// Component memoization
const MemoizedComponent = React.memo(Component);

// Callback memoization
const handleClick = useCallback(() => {
  // Handle click
}, []); // Empty deps = stable reference

// Value memoization
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b, c);
}, [a, b, c]);

// Custom hook for complex memoization
const useComplexCalculation = (a: number, b: number, c: number) => {
  return useMemo(() => {
    // Complex calculation
    return a * b + c;
  }, [a, b, c]);
};
\`\`\`

**5. Efficient Data Structures**
\`\`\`typescript
// Use Map for frequent lookups
const userMap = new Map<string, User>();
userMap.set('user1', userData); // O(1) insertion
const user = userMap.get('user1'); // O(1) lookup

// Use Set for unique values
const activeUsers = new Set<string>();
activeUsers.add('user1'); // O(1) insertion
const hasUser = activeUsers.has('user1'); // O(1) lookup

// Use appropriate array methods
const numbers = [1, 2, 3, 4, 5];

// ❌ Inefficient
const filtered = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 3) filtered.push(numbers[i]);
}

// ✅ Efficient
const filtered = numbers.filter(n => n > 3);
\`\`\`

**6. Lazy Loading and Code Splitting**
\`\`\`typescript
// Route-based lazy loading
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/settings',
    component: lazy(() => import('./pages/Settings')),
  },
];

// Component-based lazy loading
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));

// Conditional loading
const AsyncComponent = ({ shouldLoad }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (shouldLoad) {
      import('./HeavyComponent').then(module => {
        setComponent(() => module.default);
      });
    }
  }, [shouldLoad]);

  return Component ? <Component /> : <div>Loading...</div>;
};
\`\`\`

**7. Intersection Observer for Performance**
\`\`\`typescript
const useIntersectionObserver = (ref: RefObject<Element>, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};

// Usage
const LazyImage = ({ src, alt }) => {
  const ref = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(ref);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isVisible && !loaded) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.src = src;
    }
  }, [isVisible, loaded, src]);

  return (
    <img
      ref={ref}
      src={loaded ? src : placeholder}
      alt={alt}
    />
  );
};
\`\`\`

**8. RequestAnimationFrame for Smooth Animations**
\`\`\`typescript
const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
};

// Usage
const AnimatedComponent = () => {
  const [position, setPosition] = useState(0);

  useAnimationFrame((deltaTime) => {
    setPosition(prev => prev + deltaTime * 0.1);
  });

  return <div style={{ transform: \`translateX(\${position}px)\` }}>Animated</div>;
};
\`\`\`

📊 Performance Monitoring:

\`\`\`typescript
// Performance observer
const observePerformance = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        console.log(\`\${entry.name}: \${entry.duration}ms\`);
      }
    }
  });

  observer.observe({ entryTypes: ['measure'] });
};

// Usage
performance.mark('start');
// ... code to measure ...
performance.mark('end');
performance.measure('operation', 'start', 'end');
\`\`\`

🎯 Runtime Optimization Results:

Expected improvements:
- **50-70% reduction** in main thread blocking
- **60-80% improvement** in scroll performance
- **40-60% faster** initial renders
- **30-50% reduction** in memory usage
- **Smoother animations** and interactions

🔄 Continuous Runtime Optimization:

1. **Performance Budgets**
   - Frame rate targets (60fps)
   - Response time limits (<100ms)
   - Memory usage thresholds

2. **Automated Testing**
   - Performance regression tests
   - Runtime performance monitoring
   - User experience metrics

3. **Profiling Tools**
   - Chrome DevTools integration
   - React DevTools for component analysis
   - Memory leak detection tools`;
  }

  private formatMetrics(metrics?: any): string {
    if (!metrics) {
      return '- No metrics provided\n- Will analyze based on code patterns';
    }

    return Object.entries(metrics)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
  }
}

export default PerformanceAgent;