module.exports = (sequelize, DataTypes) => {
  const CategoryCote = sequelize.define(
    'CategoryCote',
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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_category_cote',
      underscored: true,
      timestamps: false,
    },
  );

  CategoryCote.associate = function(models) {
    CategoryCote.hasMany(models.Solving);
  };
  return CategoryCote;
};
