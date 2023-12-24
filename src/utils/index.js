const mapAlbumSongs = ({ id, name, year, dataSongs }) => ({
  id,
  name,
  year,
  songs: dataSongs !== null ? dataSongs : [],
});

module.exports = { mapAlbumSongs };
