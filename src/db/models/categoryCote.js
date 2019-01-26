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
