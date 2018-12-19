module.exports = (sequelize, DataTypes) => {
  const VisitCount = sequelize.define(
    'VisitCount',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      year: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      month: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING(2),
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
      tableName: 'tbl_visitcount',
      underscored: true,
      timestamps: false,
    },
  );

  VisitCount.associate = function(models) {};
  return VisitCount;
};
