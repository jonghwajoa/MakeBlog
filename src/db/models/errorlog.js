module.exports = (sequelize, DataTypes) => {
  const ErrorLog = sequelize.define(
    'ErrorLog',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: { type: DataTypes.INTEGER(4), allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: true },
      isCheck: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    },
    {
      freezeTableName: true,
      tableName: 'tbl_errorLog',
      underscored: true,
      timestamps: true,
    },
  );

  ErrorLog.associate = function(models) {};

  ErrorLog.createLog = (status, content, ip, referrer, path) => {
    return ErrorLog.create({
      status,
      content,
      ip,
      referrer,
      path,
    });
  };

  return ErrorLog;
};
