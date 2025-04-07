module.exports = {
  handle404: (req, res) => {
    return res.status(404).render("errors/404", {
      title: "Sayfa Bulunamadı",
    });
  },

  handle403: (req, res) => {
    return res.status(403).render("errors/403", {
      title: "Yetkisiz İşlem",
    });
  },

  handle500: (req, res) => {
    return res.status(500).render("errors/500", {
      title: "Sunucu Hatası",
    });
  },
};
