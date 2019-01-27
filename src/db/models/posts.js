module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    'Posts',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      tag: { type: DataTypes.STRING(100), allowNull: false },
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
      tableName: 'tbl_posts',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  Posts.associate = function(models) {
    Posts.belongsTo(models.Users, { foreignKey: 'writer' });
    Posts.belongsTo(models.Categories);
    Posts.hasMany(models.SubPosts, {
      onDelete: 'cascade',
      hooks: true,
      individualHooks: true,
    });
  };

  return Posts;
};
