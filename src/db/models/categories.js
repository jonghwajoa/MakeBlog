module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    'Categories',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      explain: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_categories',
      underscored: true,
      timestamps: false,
    },
  );

  Categories.associate = function(models) {
    Categories.hasMany(models.Posts);
  };
  return Categories;
};
