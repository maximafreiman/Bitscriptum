/* ============================================================
   BAB 13 · 13.3 LAB (Ambang aktivasi soft fork)
   ============================================================ */
(function(){
  function g(id){return document.getElementById(id);}
  function rows(p){
    return [
      {tag:'MASF',
       state: p>=95 ? 'yes' : 'no',
       verdict: p>=95 ? 'aktif' : 'gagal',
       out: p>=95
         ? 'Ambang <b>95%</b> tercapai. Soft fork aktif, dan ini jalur yang paling mulus karena hampir semua miner sudah siap.'
         : 'Ambang <b>95%</b> belum tercapai. Aktivasi tidak terjadi, dan menunggu saja bisa berlangsung tanpa batas waktu.'},
      {tag:'Speedy Trial',
       state: p>=90 ? 'yes' : 'wait',
       verdict: p>=90 ? 'aktif' : 'kedaluwarsa',
       out: p>=90
         ? 'Ambangnya lebih rendah, <b>90%</b>, dan window-nya cuma tiga bulan. Tercapai, jadi aktif tanpa berlarut-larut.'
         : 'Window tiga bulan habis tanpa mencapai <b>90%</b>. Bedanya dengan MASF: proposalnya gugur dengan rapi, bukan menggantung selamanya.'},
      {tag:'UASF',
       state: p>=51 ? 'yes' : (p>0 ? 'wait' : 'no'),
       verdict: p>=51 ? 'aktif' : (p>0 ? 'berisiko' : 'split'),
       out: p>=51
         ? 'Node ekonomi menolak block yang tidak mensinyalkan. Karena mayoritas hashrate sudah ikut, rantai mereka yang menang dan miner sisanya terpaksa menyusul.'
         : (p>0
            ? 'Node ekonomi tetap mengaktifkan aturannya, tapi mayoritas hashrate belum ikut. Untuk sementara ada dua rantai, dan siapa yang menang tergantung rantai mana yang dipakai bisnis dan pengguna.'
            : 'Tidak ada satu pun miner yang ikut. Node ekonomi menolak semua block, dan rantai mereka berhenti bertambah. Inilah risiko terburuk UASF.')},
      {tag:'URSF',
       state: p>=95 ? 'no' : 'yes',
       verdict: p>=95 ? 'kalah' : 'menahan',
       out: p>=95
         ? 'Miner sudah terlalu dominan. Node yang menolak berakhir di rantai minoritas, dan penolakan mereka tidak berpengaruh.'
         : 'Node ekonomi berhasil menahan. Selama mereka menolak block yang mengikuti aturan baru, miner tidak bisa memaksakannya sendirian.'},
    ];
  }
  function render(){
    const sl=g('b13-s133-sig'); if(!sl) return;
    const p=parseInt(sl.value,10);
    g('b13-s133-sig-val').textContent=p+'%';
    const wrap=g('b13-s133-rows'); wrap.innerHTML='';
    rows(p).forEach(r=>{
      const el=document.createElement('div');
      el.className='b13-lab-row '+r.state;
      el.innerHTML='<span class="b13-lab-tag">'+r.tag+'</span>'+
                   '<span class="b13-lab-out">'+r.out+'</span>'+
                   '<span class="b13-lab-verdict">'+r.verdict+'</span>';
      wrap.appendChild(el);
    });
    const n=g('b13-s133-lab-note');
    if(p>=95){
      n.innerHTML='Di angka setinggi ini semua mekanisme setuju, jadi pilihan mekanismenya nyaris tidak penting. <b>Perbedaan mereka baru terasa justru saat miner terpecah.</b> Geser ke bawah dan lihat.';
    } else if(p>=90){
      n.innerHTML='Perhatikan celah antara <b>90%</b> dan <b>95%</b>. Di sinilah Speedy Trial lolos tapi MASF klasik tidak. Ambang yang lebih rendah plus batas waktu itulah yang membuat Taproot bisa aktif tanpa mengulang perang bertahun-tahun.';
    } else if(p>=51){
      n.innerHTML='Inilah wilayah yang melahirkan drama SegWit 2017. Miner tidak cukup untuk mengaktifkan lewat MASF, tapi pengguna bisa memaksa lewat UASF. <b>Pertanyaannya berubah dari teknis menjadi politis:</b> siapa yang sebenarnya berhak memutuskan?';
    } else if(p>0){
      n.innerHTML='Di bawah setengah hashrate, UASF berubah dari tekanan menjadi taruhan. Rantai bisa terbelah, dan yang menentukan pemenangnya bukan hashrate melainkan <b>rantai mana yang dipakai exchange, bisnis, dan pengguna.</b>';
    } else {
      n.innerHTML='Tanpa satu pun miner yang ikut, UASF membuat node ekonomi menolak seluruh block. Ini menunjukkan batas kekuasaan pengguna: mereka bisa menentukan aturan, tapi <b>tidak bisa membuat block sendiri.</b>';
    }
  }
  const sl=g('b13-s133-sig');
  if(sl){ sl.addEventListener('input',render); render(); }
})();

var LANG="id";
var LBL={"play": "Jalankan", "pause": "Jeda", "bytes": "byte", "bits": "bit", "p2sel": "Kata ke-", "p2from": "dihitung dari", "p3step": "Ronde", "p3new": "baru dihitung", "p3shift": "bergeser turun", "verify": "Cocok dengan SHA-256 sungguhan"};

