import { StageDefinition } from '../types';

export const PROCESSING_STAGES: StageDefinition[] = [
  {
    id: 1,
    name: 'Configuration Validation',
    subtitle: 'Syntax & Topology Verification',
    minPercent: 0,
    maxPercent: 15,
    description: 'Verifying server identifiers, endpoint routing tables, IFSC formatting, and authentication tokens in temporary memory.',
    checkpoints: [
      'Parse server configuration parameters',
      'Validate IFSC cryptographic checksum structure',
      'Initialize isolated test sandbox instance',
      'Verify memory buffer allocation'
    ]
  },
  {
    id: 2,
    name: 'Synthetic Connection Test',
    subtitle: 'Virtual Handshake & Socket Ping',
    minPercent: 15,
    maxPercent: 35,
    description: 'Establishing synthetic TLS connection and measuring synthetic packet latency in an isolated local test environment.',
    checkpoints: [
      'Perform TCP/TLS virtual handshake',
      'Verify 1.2ms synthetic socket latency',
      'Verify virtual routing switch table',
      'Establish synthetic isolated session channel'
    ]
  },
  {
    id: 3,
    name: 'Server Diagnostics',
    subtitle: 'Core Health & Buffer Check',
    minPercent: 35,
    maxPercent: 55,
    description: 'Analyzing multi-core processor allocation, thread concurrency, memory isolation, and database write queues.',
    checkpoints: [
      'Run CPU instruction cache diagnostic test',
      'Execute 128-thread concurrency stress test',
      'Verify virtual memory page isolation',
      'Check failover replica cluster ping'
    ]
  },
  {
    id: 4,
    name: 'Resource Processing Load Test',
    subtitle: 'High-Throughput Workload Queue',
    minPercent: 55,
    maxPercent: 80,
    description: 'Processing high-throughput workload load test across synthetic queue batches.',
    checkpoints: [
      'Process high-frequency synthetic payload batch',
      'Synchronize distributed ledger buffer',
      'Execute cryptographic token hashing cycle',
      'Verify dynamic load balancer throughput'
    ]
  },
  {
    id: 5,
    name: 'Final Validation',
    subtitle: 'Integrity Check & Metric Summary',
    minPercent: 80,
    maxPercent: 99,
    description: 'Performing post-workload consistency verification, zero-packet loss confirmation, and compiling audit receipt.',
    checkpoints: [
      'Verify zero-loss transaction parity',
      'Aggregate memory latency & IOPS telemetry',
      'Compile cryptographic verification certificate',
      'Prepare finalized audit ledger'
    ]
  },
  {
    id: 6,
    name: 'Load Process Completed',
    subtitle: 'Audit Receipt Generated',
    minPercent: 100,
    maxPercent: 100,
    description: 'Load test lifecycle successfully concluded. All stress cycles achieved with 100% completion.',
    checkpoints: [
      'Load cycle finalized at 10:00 duration',
      'Audit report sealed with security official stamp',
      'Temporary browser session locked for verification',
      'Completion receipt ready for export'
    ]
  }
];

export const DEMO_CONFIGS = [
  {
    name: 'Primary Enterprise Switch (Demo)',
    config: {
      serverName: 'FINSERV-CORE-GATEWAY-ALPHA',
      serverUrl: 'https://core-switch.fincloud.corp/v4/rtgs',
      serverHolderName: 'Apex Enterprise Infrastructure Corp',
      serverNumber: 'SRV-8841-9920-4102',
      serverIfsc: 'HDFC0000128',
      serverLogin: 'SYS_ADMIN_CLUSTER_01',
      serverVolume: '100,000,000 TPS / MB'
    }
  },
  {
    name: 'High-Volume Settlement Node (Demo)',
    config: {
      serverName: 'GLOBAL-CLEARING-NODE-07',
      serverUrl: 'https://settlement-relay.banking-grid.internal',
      serverHolderName: 'Nexus Global Transaction Services',
      serverNumber: 'SRV-5510-7744-1293',
      serverIfsc: 'SBIN0004521',
      serverLogin: 'INFRA_ROOT_OPERATOR_9',
      serverVolume: '250,000,000 TPS / MB'
    }
  }
];
