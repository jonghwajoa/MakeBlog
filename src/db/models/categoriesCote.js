module.exports = (sequelize, DataTypes) => {
  const CategoriesCote = sequelize.define(
    'CategoriesCote',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_categories_cote',
      underscored: true,
      timestamps: false,
    },
  );

  // CategoriesCote.associate = function(models) {
  //   CategoriesCote.hasMany(models.Posts);
  // };
  return CategoriesCote;
};
