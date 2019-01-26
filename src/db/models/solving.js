module.exports = (sequelize, DataTypes) => {
  const Solving = sequelize.define(
    'Solving',
    {
      problemNum: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_Solving',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  Solving.associate = function(models) {
    Solving.belongsTo(models.CategoryCote);
    Solving.belongsTo(models.Users, { foreignKey: 'writer' });
  };

  return Solving;
};
