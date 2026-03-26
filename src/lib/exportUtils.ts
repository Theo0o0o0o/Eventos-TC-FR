import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { Participant } from '@/data/mockData';

export function exportParticipantsCSV(participants: Participant[], eventTitle: string) {
  const header = 'Nome,Email,Data de Inscrição,Presença,Tipo';
  const rows = participants.map((p) =>
    `"${p.name}","${p.email}","${format(p.registeredAt, 'dd/MM/yyyy', { locale: pt })}","${p.attendance === 'present' ? 'Presente' : p.attendance === 'absent' ? 'Ausente' : 'Pendente'}","${p.role === 'teacher' ? 'Professor' : 'Aluno'}"`
  );
  const csv = [header, ...rows].join('\n');
  downloadFile(csv, `participantes-${eventTitle}.csv`, 'text/csv;charset=utf-8;');
}

export async function exportParticipantsExcel(participants: Participant[], eventTitle: string) {
  const XLSX = await import('xlsx');
  const data = participants.map((p) => ({
    Nome: p.name,
    Email: p.email,
    'Data de Inscrição': format(p.registeredAt, 'dd/MM/yyyy', { locale: pt }),
    Presença: p.attendance === 'present' ? 'Presente' : p.attendance === 'absent' ? 'Ausente' : 'Pendente',
    Tipo: p.role === 'teacher' ? 'Professor' : 'Aluno',
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Participantes');
  XLSX.writeFile(wb, `participantes-${eventTitle}.xlsx`);
}

export async function exportParticipantsPDF(participants: Participant[], eventTitle: string) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Lista de Participantes`, 14, 20);
  doc.setFontSize(12);
  doc.text(eventTitle, 14, 30);
  doc.setFontSize(10);
  doc.text(`Total: ${participants.length} inscritos`, 14, 38);

  let y = 50;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome', 14, y);
  doc.text('Email', 80, y);
  doc.text('Presença', 160, y);
  doc.setFont('helvetica', 'normal');
  y += 8;

  participants.forEach((p) => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(p.name, 14, y);
    doc.text(p.email, 80, y);
    doc.text(p.attendance === 'present' ? 'Presente' : p.attendance === 'absent' ? 'Ausente' : 'Pendente', 160, y);
    y += 7;
  });

  doc.save(`participantes-${eventTitle}.pdf`);
}

export async function generateCertificatePDF(participantName: string, eventTitle: string, eventDate: Date) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF('landscape');

  // Border
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);
  doc.setLineWidth(1);
  doc.rect(14, 14, 269, 182);

  // Header
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Agrupamento de Escolas Tomás Cabreira', 148.5, 35, { align: 'center' });

  doc.setFontSize(32);
  doc.setTextColor(30, 58, 95);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO DE PARTICIPAÇÃO', 148.5, 60, { align: 'center' });

  // Body
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('Certifica-se que', 148.5, 85, { align: 'center' });

  doc.setFontSize(24);
  doc.setTextColor(30, 58, 95);
  doc.setFont('helvetica', 'bold');
  doc.text(participantName, 148.5, 105, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('participou no evento', 148.5, 125, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 95);
  doc.text(`"${eventTitle}"`, 148.5, 142, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`realizado no dia ${format(eventDate, "d 'de' MMMM 'de' yyyy", { locale: pt })}`, 148.5, 158, { align: 'center' });

  // Footer line
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(80, 178, 217, 178);
  doc.setFontSize(10);
  doc.text('Agrupamento de Escolas Tomás Cabreira', 148.5, 186, { align: 'center' });

  doc.save(`certificado-${participantName.replace(/\s+/g, '_')}.pdf`);
}

export async function generateCertificatesBulk(participants: Participant[], eventTitle: string, eventDate: Date) {
  for (const p of participants.filter((p) => p.attendance === 'present')) {
    await generateCertificatePDF(p.name, eventTitle, eventDate);
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
