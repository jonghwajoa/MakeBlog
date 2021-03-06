module.exports = (sequelize, DataTypes) => {
  const VisitLog = sequelize.define(
    'VisitLog',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      browser_name: {
        type: DataTypes.STRING(20),
      },
      browser_ver: {
        type: DataTypes.INTEGER(4),
      },
      os_name: {
        type: DataTypes.STRING(20),
      },
      os_ver: {
        type: DataTypes.INTEGER(4),
      },
      device: {
        type: DataTypes.STRING(50),
      },
      device_type: {
        type: DataTypes.STRING(50),
      },
      device_vender: {
        type: DataTypes.STRING(50),
      },
      ip: {
        type: DataTypes.STRING(20),
      },
      referrer: {
        type: DataTypes.TEXT,
      },
      path: {
        type: DataTypes.TEXT,
      },
      year: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
          len: {
            min: 1,
            max: 4,
          },
        },
      },
      month: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
          len: {
            min: 1,
            max: 2,
          },
        },
      },
      day: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
          len: {
            min: 1,
            max: 2,
          },
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_visitlog',
      underscored: true,
      timestamps: false,
    },
  );

  VisitLog.associate = function(models) {};

  VisitLog.createByObj = obj => {
    return VisitLog.create({
      ...obj,
    });
  };

  return VisitLog;
};
