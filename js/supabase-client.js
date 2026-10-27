/**
 * Lelana Jateng: Supabase Client & Data Service for Studio Canting
 * Menggantikan Backend Laravel (port 8000) dengan Supabase BaaS (Database & Storage)
 * Dokumentasi: https://supabase.com/docs
 */

(() => {
  'use strict';

  // Kredensial default (Dapat diisi langsung di sini atau via tombol "Koneksi Supabase" di antarmuka web)
  const DEFAULT_CONFIG = {
    url: 'https://dorygtvcekiimgflwtog.supabase.co', // Proyek Supabase user: shidoyv's Project
    anonKey: 'sb_publishable_90UP6Ys2TvaOQ0VyRC5V9Q_hCpO7etJ', // Kunci anon public Supabase
    tableName: 'karya_batik',
    bucketName: 'karya-batik'
  };

  const STORAGE_KEYS = {
    URL: 'lelana_supabase_url',
    KEY: 'lelana_supabase_anon_key'
  };

  let clientInstance = null;
  let activeUrl = '';
  let activeKey = '';

  /**
   * Mengambil URL dan Anon Key aktif (prioritas dari localStorage, fallback ke DEFAULT_CONFIG)
   */
  function getConfig() {
    let url = '';
    let anonKey = '';

    try {
      url = localStorage.getItem(STORAGE_KEYS.URL) || DEFAULT_CONFIG.url || '';
      anonKey = localStorage.getItem(STORAGE_KEYS.KEY) || DEFAULT_CONFIG.anonKey || '';
    } catch (e) {
      url = DEFAULT_CONFIG.url || '';
      anonKey = DEFAULT_CONFIG.anonKey || '';
    }

    return {
      url: url.trim().replace(/\/+$/, ''),
      anonKey: anonKey.trim(),
      tableName: DEFAULT_CONFIG.tableName,
      bucketName: DEFAULT_CONFIG.bucketName
    };
  }

  /**
   * Menyimpan URL dan Anon Key ke localStorage
   */
  function setConfig(url, anonKey) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (anonKey || '').trim();

    try {
      if (cleanUrl) {
        localStorage.setItem(STORAGE_KEYS.URL, cleanUrl);
      } else {
        localStorage.removeItem(STORAGE_KEYS.URL);
      }

      if (cleanKey) {
        localStorage.setItem(STORAGE_KEYS.KEY, cleanKey);
      } else {
        localStorage.removeItem(STORAGE_KEYS.KEY);
      }
    } catch (e) {
      console.warn('Gagal menyimpan kredensial ke localStorage:', e);
    }

    clientInstance = null;
    activeUrl = '';
    activeKey = '';
    return initClient();
  }

  /**
   * Inisialisasi Supabase Client SDK
   */
  function initClient() {
    const cfg = getConfig();

    if (!cfg.url || !cfg.anonKey) {
      clientInstance = null;
      return null;
    }

    if (clientInstance && activeUrl === cfg.url && activeKey === cfg.anonKey) {
      return clientInstance;
    }

    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      console.warn('Supabase SDK (@supabase/supabase-js) belum dimuat dari CDN.');
      return null;
    }

    try {
      clientInstance = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      activeUrl = cfg.url;
      activeKey = cfg.anonKey;
      return clientInstance;
    } catch (err) {
      console.error('Inisialisasi Supabase client gagal:', err);
      clientInstance = null;
      return null;
    }
  }

  /**
   * Mengecek apakah konfigurasi Supabase siap digunakan
   */
  function isConfigured() {
    const cfg = getConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('http'));
  }

  /**
   * Menguji koneksi ke Supabase dan tabel karya_batik
   */
  async function testConnection(testUrl, testKey) {
    const url = (testUrl || getConfig().url).trim().replace(/\/+$/, '');
    const key = (testKey || getConfig().anonKey).trim();

    if (!url || !key) {
      return {
        success: false,
        message: 'Project URL dan Anon Key tidak boleh kosong.'
      };
    }

    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      return {
        success: false,
        message: 'Pustaka Supabase JS belum siap atau gagal dimuat dari CDN.'
      };
    }

    try {
      const testClient = window.supabase.createClient(url, key);
      const { data, error } = await testClient
        .from(DEFAULT_CONFIG.tableName)
        .select('id, nama_kain')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          return {
            success: false,
            message: `Tabel '${DEFAULT_CONFIG.tableName}' belum dibuat di Supabase. Silakan jalankan script supabase_schema.sql di SQL Editor Supabase.`
          };
        }
        return {
          success: false,
          message: `Koneksi ditolak oleh Supabase (${error.message || error.code}). Periksa kembali Project URL dan Anon Key Anda.`
        };
      }

      return {
        success: true,
        message: 'Koneksi ke Supabase dan tabel karya_batik berhasil!',
        dataCount: data ? data.length : 0
      };
    } catch (err) {
      return {
        success: false,
        message: 'Terjadi kesalahan jaringan atau URL Supabase tidak valid: ' + (err.message || err)
      };
    }
  }

  /**
   * Mengonversi Base64 Data URL menjadi Blob gambar
   */
  function dataURLtoBlob(dataUrl) {
    try {
      const parts = dataUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)[1] || 'image/png';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (e) {
      console.warn('Gagal decode base64:', e);
      return null;
    }
  }

  /**
   * Mengambil daftar karya dari Supabase
   */
  async function getArtworks({ motif, limit = 40 } = {}) {
    const client = initClient();
    if (!client) {
      return { success: false, data: [], isFallback: true };
    }

    try {
      let query = client
        .from(DEFAULT_CONFIG.tableName)
        .select('*')
        .eq('is_publik', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (motif && motif !== 'Semua') {
        query = query.eq('motif', motif);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase query error:', error);
        return { success: false, error: error.message, data: [], isFallback: true };
      }

      return {
        success: true,
        data: data || [],
        isFallback: false
      };
    } catch (err) {
      console.warn('Gagal memuat galeri dari Supabase:', err);
      return { success: false, error: err.message, data: [], isFallback: true };
    }
  }

  /**
   * Menyimpan karya baru ke Supabase (Storage & Database)
   */
  async function saveArtwork(payload) {
    const client = initClient();
    if (!client) {
      return { success: false, data: null, isFallback: true, error: 'Supabase belum terkonfigurasi' };
    }

    const {
      nama_kain,
      filosofi_karya,
      palet_warna,
      motif,
      pembuat,
      gambar_base64,
      is_publik = true
    } = payload;

    let finalImageUrl = gambar_base64;

    // 1. Unggah gambar ke Supabase Storage jika memungkinkan
    if (gambar_base64 && gambar_base64.startsWith('data:image')) {
      try {
        const blob = dataURLtoBlob(gambar_base64);
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
          const rand = Math.random().toString(36).substring(2, 8);
          const fileName = `batik_${timestamp}_${rand}.png`;
          const filePath = `${fileName}`;

          const { data: uploadData, error: uploadError } = await client.storage
            .from(DEFAULT_CONFIG.bucketName)
            .upload(filePath, blob, {
              contentType: 'image/png',
              upsert: true
            });

          if (!uploadError && uploadData) {
            const { data: publicData } = client.storage
              .from(DEFAULT_CONFIG.bucketName)
              .getPublicUrl(filePath);

            if (publicData && publicData.publicUrl) {
              finalImageUrl = publicData.publicUrl;
            }
          } else {
            console.warn('Upload gambar ke bucket Supabase gagal (menggunakan data URL langsung):', uploadError?.message);
          }
        }
      } catch (uploadErr) {
        console.warn('Storage upload exception (fallback ke base64):', uploadErr);
      }
    }

    // 2. Format palet warna
    let formattedPalette = [];
    if (Array.isArray(palet_warna)) {
      formattedPalette = palet_warna;
    } else if (typeof palet_warna === 'string' && palet_warna.trim()) {
      formattedPalette = palet_warna.split(',').map(s => s.trim()).filter(Boolean);
    }

    // 3. Simpan baris ke tabel karya_batik
    const recordToInsert = {
      nama_kain: (nama_kain || 'Busana Batik Lelana').trim(),
      filosofi_karya: (filosofi_karya || '').trim(),
      file_gambar_url: finalImageUrl,
      palet_warna: formattedPalette,
      motif: motif || 'Kreasi Bebas',
      pembuat: pembuat || 'Pelancong Budaya',
      is_publik: is_publik
    };

    try {
      const { data, error } = await client
        .from(DEFAULT_CONFIG.tableName)
        .insert([recordToInsert])
        .select()
        .single();

      if (error) {
        console.error('Gagal memasukkan baris ke tabel Supabase:', error);
        return { success: false, data: null, error: error.message, isFallback: true };
      }

      return {
        success: true,
        data: data,
        isFallback: false
      };
    } catch (err) {
      console.error('Exception saat menyimpan ke Supabase:', err);
      return { success: false, data: null, error: err.message, isFallback: true };
    }
  }

  /**
   * Menghapus karya dari Supabase
   */
  async function deleteArtwork(id, fileUrl) {
    const client = initClient();
    if (!client) return { success: false };

    try {
      // 1. Hapus dari tabel database
      const { error } = await client
        .from(DEFAULT_CONFIG.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Gagal menghapus baris dari Supabase:', error);
      }

      // 2. Jika gambar berada di Supabase Storage, hapus filenya
      if (fileUrl && fileUrl.includes(`/${DEFAULT_CONFIG.bucketName}/`)) {
        try {
          const parts = fileUrl.split(`/${DEFAULT_CONFIG.bucketName}/`);
          if (parts[1]) {
            const fileName = parts[1].split('?')[0];
            await client.storage.from(DEFAULT_CONFIG.bucketName).remove([fileName]);
          }
        } catch (storageErr) {
          console.warn('Gagal menghapus berkas gambar dari storage:', storageErr);
        }
      }

      return { success: !error };
    } catch (err) {
      console.warn('Exception saat menghapus dari Supabase:', err);
      return { success: false };
    }
  }

  /**
   * Mengosongkan seluruh karya di galeri Supabase
   */
  async function clearAll() {
    const client = initClient();
    if (!client) return { success: false };

    try {
      const { error } = await client
        .from(DEFAULT_CONFIG.tableName)
        .delete()
        .neq('id', 0);

      return { success: !error };
    } catch (err) {
      console.warn('Exception saat mengosongkan tabel Supabase:', err);
      return { success: false };
    }
  }

  // Ekspor API LelanaSupabase ke jendela global
  window.LelanaSupabase = {
    getConfig,
    setConfig,
    isConfigured,
    initClient,
    testConnection,
    getArtworks,
    saveArtwork,
    deleteArtwork,
    clearAll
  };
})();
