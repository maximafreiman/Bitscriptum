// Helper: escape teks yang mengandung token <...> sebelum masuk innerHTML,
// agar token seperti <scriptHash> tampil sebagai teks, bukan ditelan parser HTML.
function bsEscHTML(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}


