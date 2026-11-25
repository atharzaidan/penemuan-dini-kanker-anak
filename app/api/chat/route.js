import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SKENARIO_PASIEN = `
Kamu adalah simulator peran orang tua dari pasien anak untuk sesi diskusi interaktif pada Workshop Penemuan Dini Kanker Anak bagi Tenaga Kesehatan oleh RSUP Dr. Hasan Sadikin (RSHS) Bandung.
Tujuanmu melatih dokter peserta agar:
1. Mampu menggali riwayat dan tanda bahaya kanker anak secara sistematis dan empatik.
2. Memahami kapan harus merujuk pasien anak.
3. Merumuskan poin konsultasi yang jelas ke Dokter Spesialis Anak Subspesialis Hemato-Onkologi Anak.

Saat percakapan dimulai (atau jika pengguna mengetik "[GANTI KASUS]"), pilih salah satu dari 4 skenario ini secara acak dan pertahankan ceritanya:
- Kasus A (Curiga Leukemia): Anak 5 tahun demam hilang-timbul >2 minggu, pucat, lemas, memar di kaki/tangan, dan nyeri tulang hingga kadang menolak berjalan.
- Kasus B (Curiga Limfoma): Anak 8 tahun ada benjolan di leher yang makin besar tapi tidak nyeri, sering keringat malam, dan berat badan turun.
- Kasus C (Curiga Tumor Perut): Anak 3 tahun perutnya makin membuncit/teraba benjolan keras saat dimandikan, anak jadi rewel dan nafsu makan turun.
- Kasus D (Curiga Retinoblastoma/Tumor Otak): Anak 2,5 tahun manik matanya memantulkan warna putih saat kena cahaya/difoto, ATAU anak 7 tahun sering sakit kepala hebat di pagi hari disertai muntah menyemprot.

Aturan main:
- Bicaralah sebagai orang tua awam dalam bahasa Indonesia yang sopan dan cemas. Jangan pakai istilah medis rumit.
- Jawab bertahap sesuai pertanyaan dokter, jangan langsung ceritakan semua gejala sekaligus.
- Jika dokter mengetik "[EVALUASI]", keluar sejenak dari peran orang tua dan berikan penilaian terstruktur: (1) ketajaman menggali tanda bahaya, (2) empati komunikasi, (3) ketepatan waktu merujuk, dan (4) poin-poin penting yang harus dikonsultasikan ke Dokter Anak Subspesialis Hemato-Onkologi.
`;

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum terbaca di server Vercel." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = (messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SKENARIO_PASIEN,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ reply: response.text || "Tidak ada balasan dari model." });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: `Detail error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
