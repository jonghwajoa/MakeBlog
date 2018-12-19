module.exports = (sequelize, DataTypes) => {
  const SubPosts = sequelize.define(
    'SubPosts',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_subposts',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  SubPosts.associate = function(models) {
    SubPosts.belongsTo(models.Posts);
  };

  return SubPosts;
};
