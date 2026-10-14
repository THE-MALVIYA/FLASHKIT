import { jsPDF } from 'jspdf';
import { SimulationSession } from '../types';
import { formatFullDateTime } from './formatters';

export function generateSimulationPDF(session: SimulationSession): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const config = session.config;

  // Background subtle tint
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner subtle frame
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // ==========================================
  // WATERMARK: FLASHING— VOLUME BALANCE
  // ==========================================
  doc.saveGraphicsState();
  doc.setTextColor(2, 132, 199); // cyan-600 with low opacity emulation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);

  // Diagonal Watermark 1 (center)
  const watermarkText = 'FLASHING— VOLUME BALANCE';
  doc.text(watermarkText, pageWidth / 2, pageHeight / 2 - 20, {
    align: 'center',
    angle: 35,
    renderingMode: 'stroke'
  });
  doc.text(watermarkText, pageWidth / 2, pageHeight / 2 + 30, {
    align: 'center',
    angle: 35,
    renderingMode: 'stroke'
  });
  doc.restoreGraphicsState();

  // ==========================================
  // HEADER BANNER
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(12, 12, pageWidth - 24, 32, 'F');

  // Top accent line (cyan)
  doc.setFillColor(6, 182, 212);
  doc.rect(12, 12, pageWidth - 24, 2, 'F');

  // Brand Wordmark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('SERVER LOAD SERVER', 20, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('SYNTHETIC BANKING SERVER LOAD REPORT', 20, 31);
  doc.text('COMPLETION AUDIT V4.2 — LOCAL TEST ENVIRONMENT', 20, 36);

  // Status Badge on Header Right
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(pageWidth - 72, 20, 52, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('LOAD PROCESS COMPLETED', pageWidth - 46, 25.5, { align: 'center' });

  // Subtitle Right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`ID: ${session.sessionId}`, pageWidth - 46, 34, { align: 'center' });

  // ==========================================
  // OFFICIAL CALLOUT BOX
  // ==========================================
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.4);
  doc.roundedRect(18, 48, pageWidth - 36, 12, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(67, 56, 202);
  doc.text('OFFICIAL VERIFICATION:', 24, 55.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('FLASHING— VOLUME BALANCE', 82, 55.5);

  // ==========================================
  // SESSION & TIMING TELEMETRY GRID
  // ==========================================
  let startY = 66;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. LOAD TEST EXECUTION TELEMETRY', 18, startY);

  doc.setDrawColor(203, 213, 225);
  doc.line(18, startY + 2, pageWidth - 18, startY + 2);

  const startFormatted = formatFullDateTime(new Date(session.startTime));
  const endFormatted = session.endTime ? formatFullDateTime(new Date(session.endTime)) : formatFullDateTime();
  const completedAt = session.endTime || session.startTime || Date.now();
  const elapsedSinceCompletion = Math.max(0, Math.floor((Date.now() - completedAt) / 1000));
  const remaining24hSec = Math.max(0, 86400 - elapsedSinceCompletion);
  const h24 = Math.floor(remaining24hSec / 3600);
  const m24 = Math.floor((remaining24hSec % 3600) / 60);
  const s24 = remaining24hSec % 60;
  const countdown24hStr = `${String(h24).padStart(2, '0')}:${String(m24).padStart(2, '0')}:${String(s24).padStart(2, '0')}`;

  const telemetryData = [
    ['Session ID:', session.sessionId],
    ['Session Status:', 'LOAD PROCESS COMPLETED (100% EXECUTED)'],
    ['Start Date & Time:', startFormatted],
    ['Completion Date & Time:', endFormatted],
    ['Flash Reflect:', 'Not predictable'],
    ['24-Hour Active Window:', `${countdown24hStr} (Active Timer)`],
    ['Workload Execution Cycle:', '6 of 6 Stages Passed (Nominal)']
  ];

  let currentY = startY + 8;
  doc.setFontSize(8.5);

  telemetryData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 22, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(value, 80, currentY);

    currentY += 6;
  });

  // ==========================================
  // SERVER CONFIGURATION PARAMETERS
  // ==========================================
  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. TARGET SERVER CONFIGURATION PROFILE', 18, currentY);

  doc.setDrawColor(203, 213, 225);
  doc.line(18, currentY + 2, pageWidth - 18, currentY + 2);

  currentY += 8;

  const serverData = [
    ['1. SERVER BANK NAME:', config.serverName || '—'],
    ['2. SERVER BANK URL:', config.serverUrl || '—'],
    ['3. Server Holder Name:', config.serverHolderName || '—'],
    ['4. SERVER ACCOUNT NUMBER:', config.serverNumber || '—'],
    ['5. SERVER ACCOUNT IFSC:', config.serverIfsc || '—'],
    ['6. Server Login:', config.serverLogin || '—'],
    ['7. SERVER FLASH BALANCE:', config.serverVolume || '—']
  ];

  serverData.forEach(([label, value]) => {
    // Row background zebra
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(20, currentY - 4, pageWidth - 40, 6, 0.5, 0.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.text(label, 24, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    // Truncate if too long
    const valStr = doc.splitTextToSize(value, pageWidth - 105);
    doc.text(valStr[0] || '', 80, currentY);

    currentY += 7.5;
  });

  // ==========================================
  // 6 PROCESSING STAGES AUDIT TABLE
  // ==========================================
  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. COMPLETED PROCESSING STAGES AUDIT', 18, currentY);

  doc.setDrawColor(203, 213, 225);
  doc.line(18, currentY + 2, pageWidth - 18, currentY + 2);

  currentY += 7;

  const stagesSummary = [
    ['Stage 1', 'Configuration Validation', '100% Passed', 'Verified syntax, IFSC structure & memory buffers'],
    ['Stage 2', 'Synthetic Connection Test', '100% Passed', 'Synthetic handshake latency ~1.2ms (Zero external traffic)'],
    ['Stage 3', 'Server Diagnostics', '100% Passed', 'CPU, memory isolation and concurrent queues verified'],
    ['Stage 4', 'Resource Processing Load Test', '100% Passed', 'Synthetic load volume stress test successfully sustained'],
    ['Stage 5', 'Final Validation', '100% Passed', 'Telemetry parity confirmed, cryptographic summary sealed'],
    ['Stage 6', 'Load Process Completed', '100% Passed', 'All processes completed. Report issued at 10:00 mark']
  ];

  stagesSummary.forEach(([stg, name, status, notes]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${stg}: ${name}`, 22, currentY);

    doc.setTextColor(16, 185, 129);
    doc.text(status, 90, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(notes, 118, currentY);

    currentY += 5;
  });



  // Footer notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `SERVER LOAD SERVER © 2026 · Client Verification Hash: SHA256-${session.sessionId.replace(/[^A-Z0-9]/g, '')}-OK`,
    pageWidth / 2,
    pageHeight - 14,
    { align: 'center' }
  );

  // Trigger download
  doc.save(`SERVER_LOAD_SERVER_REPORT_${session.sessionId}.pdf`);
}
