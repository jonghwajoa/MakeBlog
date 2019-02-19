module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    'Posts',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
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

    Posts.hasMany(models.AssociationTag, {
      foreignKey: 'post_no',
      as: 'tag',
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

  Posts.findAllWithPaging = (pageNum = 20, offset = 0) => {
    return Posts.findAll({
      // limit: pageNum,
      offset,
      attributes: [
        'no',
        'title',
        'count',
        [sequelize.fn('date_format', sequelize.col('created_at'), '%Y.%m.%d'), 'created_at'],
      ],
      order: [['no', 'DESC']],
      include: [
        {
          model: sequelize.models.AssociationTag,
          as: 'tag',
          attributes: ['tag_no'],
          include: [{ model: sequelize.models.Tags, attributes: ['name'] }],
        },
      ],
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
      include: [
        {
          model: sequelize.models.AssociationTag,
          as: 'tag',
          attributes: ['tag_no'],
          include: [{ model: sequelize.models.Tags, attributes: ['name'] }],
        },
      ],
    });
  };

  Posts.findByIdForUpdate = id => {
    return Posts.findById(id, {
      attributes: ['no', 'title', 'content'],
      include: [
        {
          model: sequelize.models.AssociationTag,
          as: 'tag',
          attributes: ['tag_no'],
          include: [{ model: sequelize.models.Tags, attributes: ['name'] }],
        },
      ],
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

  Posts.updateTransaction = (no, params, transaction) => {
    return Posts.update(
      {
        ...params,
        include: [{ model: sequelize.models.AssociationTag }],
      },
      {
        where: { no },
      },

      transaction,
    );
  };

  return Posts;
};
