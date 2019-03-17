module.exports = (sequelize, DataTypes) => {
  const VisitCount = sequelize.define(
    'VisitCount',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
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
        type: DataTypes.INTEGER.UNSIGNED,
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

  VisitCount.findOrCreateToday = (year, month, day) => {
    return VisitCount.findOrCreate({
      where: {
        year,
        month,
        day,
      },
    });
  };

  VisitCount.findMontly = (year, month) => {
    return VisitCount.findAll({
      raw: true,
      where: { year, month },
      attributes: ['day', 'count'],
    });
  };

  VisitCount.findMonthCount = (year, month) => {
    return VisitCount.sum('count', {
      where: { year, month },
    });
  };

  VisitCount.findToalCount = month => {
    return VisitCount.sum('count');
  };

  return VisitCount;
};
