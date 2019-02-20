module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      id: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
        validate: { len: [5, 20], isLowercase: true },
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      grade: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 2,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_users',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  Users.associate = function(models) {
    Users.hasMany(models.Posts, { foreignKey: 'writer' });
    Users.hasMany(models.Solving, { foreignKey: 'writer' });
    Users.belongsTo(models.UserGrade, { target: 'grade' });
  };

  Users.createTransaction = (no, id, nickname, transaction) => {
    return Users.create(
      {
        no,
        nickname,
        id,
      },
      { transaction },
    );
  };

  return Users;
};
