module.exports = (sequelize, DataTypes) => {
  const UserLogin = sequelize.define(
    'UserLogin',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: { len: [5, 20], isLowercase: true },
      },
      hash: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [40, 100] },
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_userLogin',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  UserLogin.associate = function(models) {};

  UserLogin.findOneById = id => {
    return UserLogin.findOne({
      where: {
        id,
      },
    });
  };

  UserLogin.createTransaction = (id, pw, transaction) => {
    return UserLogin.create(
      {
        id,
        hash: pw,
      },
      { transaction },
    );
  };

  return UserLogin;
};
