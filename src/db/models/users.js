module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      no: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
    Users.belongsTo(models.UserGrade, { target: 'grade' });
  };
  return Users;
};
