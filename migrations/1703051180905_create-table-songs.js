/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'integer',
      notNull: false,
    },
    albumId: {
      type: 'VARCHAR(50)',
      notNull: false,
      default: null,
      references: 'Albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  //   pgm.addConstraint('songs', 'songs_albumId_fk', {
  //     foreignKeys: {
  //       columns: 'albumId',
  //       references: 'albums(id)',
  //     },
  //   });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
