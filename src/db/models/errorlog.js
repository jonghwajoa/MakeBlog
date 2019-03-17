module.exports = (sequelize, DataTypes) => {
  const ErrorLog = sequelize.define(
    'ErrorLog',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
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

  ErrorLog.findAllWithPaging = () => {
    return ErrorLog.findAll({
      raws: true,
      limit: 20,
      attributes: [
        'no',
        'status',
        'content',
        'isCheck',
        'referrer',
        'path',
        [sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d %h시%d분%s초'), 'created_at'],
      ],
      order: [['created_at', 'DESC']],
    });
  };

  return ErrorLog;
};
