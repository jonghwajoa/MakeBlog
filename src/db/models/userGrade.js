module.exports = (sequelize, DataTypes) => {
  const UserGrade = sequelize.define(
    'UserGrade',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      explain: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_usergrade',
      underscored: true,
      timestamps: false,
      paranoid: true,
    },
  );

  UserGrade.associate = function(models) {
    UserGrade.hasMany(models.Users);
  };

  return UserGrade;
};
