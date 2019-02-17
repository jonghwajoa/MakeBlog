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
    Posts.hasMany(models.SubPosts, {
      onDelete: 'cascade',
      hooks: true,
    });

    Posts.belongsToMany(models.Tags, {
      through: models.AssociationTag,
      foreignKey: 'post_no',
    });
  };

  /* instance Method */
  Posts.prototype.getNo = function() {
    return this.no;
  };

  Posts.prototype.getCount = function() {
    return this.count;
  };

  /* class Method */
  Posts.createPost = ({ title, content }, writer) => {
    return Posts.create({
      title,
      content,
      writer,
    });
  };

  Posts.findDetailById = id => {
    return Posts.findById(id, {
      attributes: [
        'no',
        'title',
        'content',
        'count',
        [sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'created_at'],
      ],
      include: [{ model: sequelize.models.Tags, attributes: ['name'], through: { attributes: [] } }],
    });
  };

  Posts.findByIdCustom = id => {
    return Posts.findById(id, {
      attributes: ['no', 'title', 'content'],
    });
  };

  Posts.findHotPost = () => {
    return Posts.findAll({
      limit: 5,
      attributes: ['no', 'title'],
      order: [['count', 'desc']],
    });
  };

  Posts.totalCount = () => {
    return Posts.count();
  };

  return Posts;
};
