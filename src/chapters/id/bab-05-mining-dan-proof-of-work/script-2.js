/* ============================================================
   BAB 5 · 5.4 LAB (Difficulty adjustment interaktif)
   ============================================================ */
(function(){
  function g(id){return document.getElementById(id);}
  function f1(x){return (Math.round(x*10)/10).toFixed(1);}
  function render(){
    const sl=g('b05-s54-hr'); if(!sl) return;
    const m=parseInt(sl.value,10)/10;              // pengali hashrate
    const bt=10/m;                                  // menit per block
    const days=(2016*bt)/1440;
    const clamped=Math.min(4,Math.max(0.25,m));     // batas 4x naik/turun
    const after=10*clamped/m;
    g('b05-s54-hr-val').textContent=f1(m)+'x';
    g('b05-s54-bt').textContent=f1(bt)+' menit';
    g('b05-s54-dur').textContent=f1(days)+' hari';
    const pct=(clamped-1)*100;
    g('b05-s54-adj').textContent=(Math.abs(pct)<0.5?'tetap':(pct>0?'+':'')+Math.round(pct)+'%');
    g('b05-s54-after').textContent=f1(after)+' menit';
    const cell=g('b05-s54-after-cell'), note=g('b05-s54-note');
    const kena=(m>4||m<0.25);
    cell.className='b05-lab-cell'+(kena?' warn':'');
    g('b05-s54-after').className='b05-lab-v '+(kena?'amber':'green');
    if(Math.abs(m-1)<0.05){
      note.className='b05-lab-note';
      note.innerHTML='Hashrate stabil, jadi tidak ada yang perlu disesuaikan. Geser slider untuk melihat apa yang terjadi kalau miner berdatangan atau pergi.';
    } else if(!kena){
      note.className='b05-lab-note';
      note.innerHTML=(m>1
        ? 'Miner bertambah, block ditemukan lebih cepat dari 10 menit, jadi periode ini selesai lebih awal. Jaringan menaikkan difficulty <b>'+Math.round(pct)+'%</b> dan waktu block kembali ke 10 menit.'
        : 'Miner pergi, block jadi lebih lambat, jadi periode ini molor. Jaringan menurunkan difficulty <b>'+Math.round(pct)+'%</b> dan waktu block kembali ke 10 menit.')
        +' Tidak ada yang memutuskan ini. Setiap node menghitungnya sendiri dan hasilnya selalu sama.';
    } else {
      note.className='b05-lab-note warn';
      note.innerHTML='Perubahannya terlalu ekstrem. Bitcoin membatasi penyesuaian maksimal <b>4 kali lipat</b> per periode, jadi sekali koreksi belum cukup: waktu block masih '+f1(after)+' menit, belum 10. Perlu beberapa periode lagi untuk pulih sepenuhnya. Batas ini ada supaya satu periode aneh tidak bisa mengguncang jaringan sekaligus.';
    }
  }
  const sl=g('b05-s54-hr');
  if(sl){ sl.addEventListener('input',render); render(); }
})();

/* ============================================================
   BAB 5 · 5.5 LAB (Jadwal emisi interaktif)
   ============================================================ */
(function(){
  function g(id){return document.getElementById(id);}
  const BLOCKS=210000, TOTAL=21000000;
  function fmt(n,d){ return n.toLocaleString('id-ID',{minimumFractionDigits:d||0,maximumFractionDigits:d||0}); }
  function supplyAt(era){
    let s=0;
    for(let n=0;n<=era;n++){ s += BLOCKS*(50/Math.pow(2,n)); }
    return s;
  }
  function render(){
    const sl=g('b05-s55-era'); if(!sl) return;
    const e=parseInt(sl.value,10);
    const reward=50/Math.pow(2,e);
    const habis=reward*1e8 < 1;                 // di bawah 1 satoshi
    const supply=Math.min(supplyAt(e),TOTAL);
    const pct=supply/TOTAL*100;
    g('b05-s55-era-val').textContent='era '+e;
    g('b05-s55-year').textContent='~'+(e===0?2009:2008+e*4);
    g('b05-s55-reward').textContent = habis ? '0 BTC'
      : (reward>=0.001 ? String(parseFloat(reward.toFixed(8))).replace('.',',')+' BTC'
                       : Math.round(reward*1e8)+' sat');
    g('b05-s55-supply').textContent=fmt(supply,0)+' BTC';
    g('b05-s55-pct').textContent=fmt(pct,2)+'%';
    g('b05-s55-bar').style.width=Math.min(100,pct)+'%';
    const note=g('b05-s55-note');
    if(e===0){
      note.className='b05-lab-note';
      note.innerHTML='Era pertama, reward 50 BTC per block. Perhatikan bahwa hanya dalam satu era ini saja sudah tercetak <b>seperempat</b> dari seluruh Bitcoin yang akan pernah ada.';
    } else if(!habis){
      const sisa=TOTAL-supply;
      note.className='b05-lab-note';
      note.innerHTML='Reward sudah dibelah '+e+' kali. Yang tersisa untuk ditambang selama <b>seluruh sisa waktu</b> tinggal sekitar '+fmt(sisa,0)+' BTC. Kurvanya melambat terus, mendekati 21 juta tanpa pernah benar-benar menyentuhnya.';
    } else {
      note.className='b05-lab-note warn';
      note.innerHTML='Reward sudah jatuh di bawah satu satoshi, jadi secara praktis <b>nol</b>. Sekitar tahun 2140, tidak ada lagi Bitcoin baru yang tercetak. Sejak titik itu, satu-satunya pendapatan miner adalah <b>fee transaksi</b>. Inilah alasan kenapa pertanyaan tentang fee di Bab 9 bukan soal ongkos kirim, melainkan soal siapa yang membayar keamanan jaringan.';
    }
  }
  const sl=g('b05-s55-era');
  if(sl){ sl.addEventListener('input',render); render(); }
})();

