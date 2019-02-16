module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define(
    'Tags',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_tags',
      underscored: true,
      timestamps: false,
      paranoid: false,
    },
  );

  Tags.associate = function(models) {};

  return Tags;
};
